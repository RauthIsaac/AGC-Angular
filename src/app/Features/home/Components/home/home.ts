import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { HeroSection } from '../hero-section/hero-section';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Ceo } from "../ceo/ceo";
import { News } from "../news/news";
import { Subscription } from 'rxjs';
import { NavigationService } from '../../../../Shared/services/NavigationService/navigation-service';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { Values } from "../values/values";
import { ServingSectors } from "../serving-sectors/serving-sectors";
import { Clients } from "../clients/clients";
import { Products } from "../products/products";

@Component({
  selector: 'app-home',
  imports: [HeroSection, Ceo, News, About, Values, Contact, ServingSectors, Clients, Products],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
  // Inject services using modern Angular inject function
  private navigationService = inject(NavigationService);
  private languageService = inject(LanguageService);


  activeSection: string = 'home';
  private subscription: Subscription = new Subscription();

  // Signals for reactive data
  siteIdentityData = signal<any>(null);
  currentLanguage = signal<string>('en');
  isRTLSignal = signal<boolean>(false);
  currentLanguageName = signal<string>('English');
  currentLanguageFlag = signal<string>('🇺🇸');
  isLoadingSignal = signal<boolean>(false);

  ngOnInit() {
    // Subscribe to active section changes
    this.subscription.add(
      this.navigationService.activeSection$.subscribe(section => {
        this.activeSection = section;
      })
    );

    // Subscribe to language changes
    this.subscription.add(
      this.languageService.currentLanguage$.subscribe(lang => {
        this.currentLanguage.set(lang);
        this.isRTLSignal.set(this.languageService.isRTL());
        this.currentLanguageName.set(this.languageService.getCurrentLanguageName());
        this.currentLanguageFlag.set(this.languageService.getCurrentLanguageFlag());
      })
    );

    // Subscribe to site data changes from LanguageService
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(data => {
        this.siteIdentityData.set(data);
        // //console.log('Current site data updated:', data);
      })
    );

    // Subscribe to loading state from LanguageService
    this.subscription.add(
      this.languageService.isLoading$.subscribe(loading => {
        this.isLoadingSignal.set(loading);
      })
    );

    // Initialize with current language (this will trigger data loading)
    const currentLang = this.languageService.getCurrentLanguage();
    this.languageService.setLanguage(currentLang);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Navigation Methods
  navigateToSection(sectionId: string) {
    this.navigationService.navigateToSection(sectionId);
  }

  isActive(section: string): boolean {
    return this.navigationService.isActive(section);
  }

  // Language Methods
  isRTL(): boolean {
    return this.isRTLSignal();
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  switchToLanguage(languageCode: string) {
    this.languageService.setLanguage(languageCode);
  }

  getText(key: string, fallback?: string): string {
    return this.languageService.getText(key, fallback);
  }

  // Utility Methods
  isLoading(): boolean {
    return this.isLoadingSignal();
  }

  getLogoUrl(): string {
    return this.getText('logoUrl');
  }

  getCompanyName(): string {
    return this.getText('companyName', 'AGC Lubricants');
  }

  getCurrentSiteData() {
    return this.siteIdentityData();
  }

  hasSiteData(): boolean {
    return this.siteIdentityData() !== null;
  }

  // Additional helper methods for child components
  getCurrentLanguageName(): string {
    return this.currentLanguageName();
  }

  getCurrentLanguageFlag(): string {
    return this.currentLanguageFlag();
  }

  getCurrentLanguage(): string {
    return this.currentLanguage();
  }
}