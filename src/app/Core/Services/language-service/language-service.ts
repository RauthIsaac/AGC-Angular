// Core/Services/language-service/language-service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  private translationsSubject = new BehaviorSubject<any>({});
  
  public readonly availableLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      direction: 'ltr',
      flag: '🇺🇸'
    },
    {
      code: 'ar',
      name: 'العربية',
      direction: 'rtl',
      flag: '🇸🇦'
    }
  ];
  
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  public translations$ = this.translationsSubject.asObservable();
  
  constructor() {
    this.initializeLanguage();
  }
  
  private initializeLanguage(): void {
    let defaultLanguage = 'en';
    
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage && this.isLanguageSupported(savedLanguage)) {
        defaultLanguage = savedLanguage;
      }
    }
    
    this.setLanguage(defaultLanguage).subscribe();
  }
  
  public setLanguage(languageCode: string): Observable<any> {
    if (!this.isLanguageSupported(languageCode)) {
      console.error(`Language '${languageCode}' is not supported`);
      return of(null);
    }
    
    return this.loadTranslations(languageCode).pipe(
      tap(translations => {
        if (translations) {
          this.currentLanguageSubject.next(languageCode);
          this.translationsSubject.next(translations);
          
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('selectedLanguage', languageCode);
            this.updateDocumentLanguage(languageCode);
          }
        }
      }),
      catchError(error => {
        console.warn(`Failed to load language ${languageCode}, using fallback`, error);
        if (languageCode !== 'en') {
          return this.setLanguage('en');
        }
        return of(null);
      })
    );
  }
  
  private loadTranslations(languageCode: string): Observable<any> {
    const translationPath = `Assets/i18n/${languageCode}.json`;
    
    return this.http.get(translationPath).pipe(
      catchError(error => {
        console.error(`Error loading translations for language '${languageCode}':`, error);
        return of(null);
      })
    );
  }
  
  
  public getText(key: string, params?: { [key: string]: any }): string {
    const translations = this.translationsSubject.value;
    
    if (!translations || Object.keys(translations).length === 0) {
      console.warn(`No translations loaded, returning key: ${key}`);
      return key;
    }
    
    let translation = translations[key];
    
    if (!translation) {
      translation = this.getNestedTranslation(translations, key);
    }
    
    if (!translation) {
      console.warn(`Translation not found for key: '${key}'`);
      return key;
    }
  
    if (Array.isArray(translation)) {
      return translation.join(', ');
    }
    
    if (typeof translation === 'object' && translation !== null) {
      if (translation.name) return translation.name;
      if (translation.title) return translation.title;
      if (translation.description) return translation.description;
      return JSON.stringify(translation);
    }
    
    if (params && typeof translation === 'string') {
      return this.interpolateParams(translation, params);
    }
    
    return String(translation);
  }
  
  private getNestedTranslation(obj: any, key: string): any {
    return key.split('.').reduce((current, keyPart) => {
      return current && current[keyPart] ? current[keyPart] : null;
    }, obj);
  }
  
  private interpolateParams(text: string, params: { [key: string]: any }): string {
    return Object.keys(params).reduce((result, key) => {
      const placeholder = `{${key}}`;
      return result.replace(new RegExp(placeholder, 'g'), params[key]);
    }, text);
  }
  
  private isLanguageSupported(languageCode: string): boolean {
    return this.availableLanguages.some(lang => lang.code === languageCode);
  }
  
  private updateDocumentLanguage(languageCode: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    if (!language) return;
    
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    htmlElement.setAttribute('lang', languageCode);
    htmlElement.setAttribute('dir', language.direction);
    
    bodyElement.classList.toggle('rtl', language.direction === 'rtl');
  }
  
  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }
  
  public getCurrentLanguageInfo(): Language | undefined {
    const currentLang = this.getCurrentLanguage();
    return this.availableLanguages.find(lang => lang.code === currentLang);
  }
  
  public isRTL(): boolean {
    const currentLangInfo = this.getCurrentLanguageInfo();
    return currentLangInfo?.direction === 'rtl' || false;
  }
  
  public toggleLanguage(): Observable<any> {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    return this.setLanguage(newLang);
  }
  
  public getAllTranslations(): any {
    return this.translationsSubject.value;
  }
  
  public getArrayItem(key: string, index: number): string {
    const data = this.getAllTranslations()[key];
    if (Array.isArray(data) && data[index]) {
      return data[index];
    }
    return '';
  }
  
  public getObjectProperty(key: string, property: string): string {
    const data = this.getAllTranslations()[key];
    if (typeof data === 'object' && data !== null && data[property]) {
      return data[property];
    }
    return '';
  }
  
  public getObjectArray(key: string): any[] {
    const data = this.getAllTranslations()[key];
    return Array.isArray(data) ? data : [];
  }
  
  public updateTranslations(translations: any): void {
    this.translationsSubject.next({ ...this.translationsSubject.value, ...translations });
  }
}