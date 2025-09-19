import { Component, signal } from '@angular/core';
import { Header } from '../../../../Shared/header/header';
import { HeroSection } from '../hero-section/hero-section';
import { Footer } from '../../../../Shared/footer/footer';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Ceo } from "../ceo/ceo";
import { News } from "../news/news";
import { Subscription } from 'rxjs';
import { NavigationService } from '../../../../Shared/services/NavigationService/navigation-service';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { SiteIdentityService } from '../../../../Shared/services/SiteIdentityService/site-identity-service';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, HeroSection, About, Contact, Ceo, News],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  activeSection: string = 'home';
  private subscription: Subscription = new Subscription();

  // Signals for reactive data
  siteIdentityData = signal<any>(null);
  currentLanguage = signal<string>('en');
  isRTLSignal = signal<boolean>(false);
  currentLanguageName = signal<string>('English');
  currentLanguageFlag = signal<string>('🇺🇸');
  isLoadingSignal = signal<boolean>(false);

  constructor(
    private navigationService: NavigationService,
    private languageService: LanguageService,
    private siteIdentityService: SiteIdentityService
  ) {}

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

    // Subscribe to site data changes
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(data => {
        this.siteIdentityData.set(data);
        console.log('Current site data updated:', data);
        this.isLoadingSignal.set(false);
      })
    );

    // Load site data from API - ONLY ONCE HERE
    this.loadSiteIdentityData();
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

  // Data Loading - CENTRALIZED HERE
  private loadSiteIdentityData() {
    this.isLoadingSignal.set(true);
    
    this.subscription.add(
      this.siteIdentityService.getSiteIdentity().subscribe({
        next: (data) => {
          console.log('Site data loaded successfully:', data);
          this.siteIdentityData.set(data);
          this.isLoadingSignal.set(false);
        },
        error: (error) => {
          console.error('Error loading site data:', error);
          this.isLoadingSignal.set(false);
        }
      })
    );
  }

  // Utility Methods
  isLoading(): boolean {
    return this.isLoadingSignal() || this.siteIdentityService.isDataLoading?.() || false;
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

  getNewsById(id: number) {
    const data = this.siteIdentityData();
    return data?.news?.find((news: any) => news.id === id);
  }

  getProductById(id: number) {
    const data = this.siteIdentityData();
    return data?.products?.find((product: any) => product.id === id);
  }
}