import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { SiteData } from '../../../Shared/models/site-data';
import { API_ENDPOINTS, API_URL} from '../../../Constants/api-endpoints'; 


export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  langCode: number;
}


@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  private currentSiteDataSubject = new BehaviorSubject<SiteData | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);


  public readonly availableLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      direction: 'ltr',
      flag: '🇺🇸',
      langCode: 0
    },
    {
      code: 'ar',
      name: 'العربية',
      direction: 'rtl',
      flag: '🇸🇦',
      langCode: 1
    }
  ];
  
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  public currentSiteData$ = this.currentSiteDataSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  
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
    
    this.setLanguage(defaultLanguage);
  }
  
  /**
   * Set language and load corresponding site data
   */
  public setLanguage(languageCode: string): void {
    if (!this.isLanguageSupported(languageCode)) {
      console.error(`Language '${languageCode}' is not supported`);
      return;
    }
    
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    if (!language) return;

    this.currentLanguageSubject.next(languageCode);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', languageCode);
      this.updateDocumentLanguage(languageCode);
    }
    
    // Load site data for the selected language
    this.loadSiteDataByLangCode(language.langCode);
  }

  /**
   * Load site data by language code from API
   */
  private loadSiteDataByLangCode(langCode: number): void {
    this.isLoadingSubject.next(true);
        
    const apiUrl = API_URL + API_ENDPOINTS.SITE_IDENDITY.GET;

    this.http.get<SiteData>(`${apiUrl}/${langCode}`).pipe(
      tap((data: SiteData) => {
        this.currentSiteDataSubject.next(data);
        console.log('Site Data with Language Code', langCode, 'loaded:', data);
        this.isLoadingSubject.next(false);
      }),
      catchError((error: any) => {
        console.error('Error loading site data:', error);
        this.isLoadingSubject.next(false);
        return of(null);
      })
    ).subscribe();
  }
  
  /**
   * Get text/data based on current site data
   */
  public getText(key: string, fallback?: string): string {
    const currentData = this.currentSiteDataSubject.value;
    
    if (!currentData) {
      // console.warn(`No site data loaded, returning fallback or key: ${key}`);
      return fallback || key;
    }
    
    // Handle nested properties using dot notation
    const value = this.getNestedProperty(currentData, key);
    
    if (value === undefined || value === null) {
      console.warn(`Property '${key}' not found in current site data`);
      return fallback || key;
    }
    
    return String(value);
  }
  
  /**
   * Get nested property from object using dot notation
   */
  private getNestedProperty(obj: any, key: string): any {
    return key.split('.').reduce((current, keyPart) => {
      return current && current[keyPart] !== undefined ? current[keyPart] : undefined;
    }, obj);
  }
  
  /**
   * Get array data (like news or products)
   */
  public getArrayData(key: string): any[] {
    const currentData = this.currentSiteDataSubject.value;
    
    if (!currentData || !currentData[key as keyof SiteData]) {
      return [];
    }
    
    const data = currentData[key as keyof SiteData];
    return Array.isArray(data) ? data : [];
  }
  
  /**
   * Get specific array item by index
   */
  public getArrayItem(key: string, index: number): any {
    const arrayData = this.getArrayData(key);
    return arrayData[index] || null;
  }
  
  /**
   * Filter array data by property
   */
  public filterArrayData(key: string, filterFn: (item: any) => boolean): any[] {
    const arrayData = this.getArrayData(key);
    return arrayData.filter(filterFn);
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
    
    // Set language and direction attributes
    htmlElement.setAttribute('lang', languageCode);
    htmlElement.setAttribute('dir', language.direction);
    
    // Add/remove RTL class on body
    bodyElement.classList.toggle('rtl', language.direction === 'rtl');
    bodyElement.classList.toggle('ltr', language.direction === 'ltr');
    
    // Trigger a custom event for other components to listen to
    if (isPlatformBrowser(this.platformId)) {
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { 
          language: languageCode, 
          direction: language.direction 
        } 
      }));
    }
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
  
  public toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }
  
  /**
   * Get current site data
   */
  public getCurrentSiteData(): SiteData | null {
    return this.currentSiteDataSubject.value;
  }
  
  /**
   * Check if data is loading
   */
  public isLoading(): boolean {
    return this.isLoadingSubject.value;
  }
  
  /**
   * Get language-specific flag emoji
   */
  public getCurrentLanguageFlag(): string {
    const currentLangInfo = this.getCurrentLanguageInfo();
    return currentLangInfo?.flag || '🌐';
  }
  
  /**
   * Get language name for display
   */
  public getCurrentLanguageName(): string {
    const currentLangInfo = this.getCurrentLanguageInfo();
    return currentLangInfo?.name || 'Unknown';
  }

  /**
   * Refresh current language data
   */
  public refreshCurrentLanguageData(): void {
    const currentLangInfo = this.getCurrentLanguageInfo();
    if (currentLangInfo) {
      this.loadSiteDataByLangCode(currentLangInfo.langCode);
    }
  }
}