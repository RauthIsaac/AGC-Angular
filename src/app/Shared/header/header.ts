import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NavigationService } from '../services/NavigationService/navigation-service';
import { SiteIdentityService } from '../services/SiteIdentityService/site-identity-service';
import { LanguageService } from '../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  activeSection: string = 'home';
  private subscription: Subscription = new Subscription();

  // Signals for reactive data
  siteIdentityData = signal<any>(null);
  currentLanguage = signal<string>('en');
  isRTLSignal = signal<boolean>(false);
  currentLanguageName = signal<string>('English');
  currentLanguageFlag = signal<string>('🇺🇸');
  isLoadingSignal = signal<boolean>(false);
  debugMode = signal<boolean>(false);

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

    // Load site data from API
    this.loadSiteIdentityData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /*====================================================================*/
  //#region Navigation Methods
  navigateToSection(sectionId: string) {
    this.navigationService.navigateToSection(sectionId);
  }

  isActive(section: string): boolean {
    return this.navigationService.isActive(section);
  }
  //#endregion

  /*====================================================================*/
  //#region Language Methods

  /**
   * Get RTL status
   */
  isRTL(): boolean {
    return this.isRTLSignal();
  }

  /**
   * Toggle between English and Arabic
   */
  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  /**
   * Switch to specific language
   */
  switchToLanguage(languageCode: string) {
    this.languageService.setLanguage(languageCode);
  }

  /**
   * Get text using the language service
   */
  getText(key: string, fallback?: string): string {
    return this.languageService.getText(key, fallback);
  }

  //#endregion

  /*====================================================================*/
  //#region Data Loading

  /**
   * Load site identity data from your API
   */
  private loadSiteIdentityData() {
    this.isLoadingSignal.set(true);
    
    this.subscription.add(
      this.siteIdentityService.getSiteIdentity().subscribe({
        next: (data) => {
          console.log('Site data loaded successfully:', data);
          this.isLoadingSignal.set(false);
        },
        error: (error) => {
          console.error('Error loading site data:', error);
          this.isLoadingSignal.set(false);
        }
      })
    );
  }

  //#endregion

  //#region Utility Methods

  /**
   * Check if data is loading
   */
  isLoading(): boolean {
    return this.isLoadingSignal() || this.siteIdentityService.isDataLoading?.() || false;
  }


  /**
   * Toggle debug mode
   */
  toggleDebug() {
    this.debugMode.set(!this.debugMode());
  }

  /**
   * Get company logo URL with fallback
   */
  getLogoUrl(): string {
    return this.getText('logoUrl');

  }

  /**
   * Get company name with fallback
   */
  getCompanyName(): string {
    return this.getText('companyName', 'AGC Lubricants');
  }

  //#endregion

  //#region Helper Methods for Template

  /**
   * Get current site data
   */
  getCurrentSiteData() {
    return this.siteIdentityData();
  }

  /**
   * Check if site data is available
   */
  hasSiteData(): boolean {
    return this.siteIdentityData() !== null;
  }

  /**
   * Get specific news by ID (if needed)
   */
  getNewsById(id: number) {
    const data = this.siteIdentityData();
    return data?.news?.find((news: any) => news.id === id);
  }

  /**
   * Get specific product by ID (if needed)
   */
  getProductById(id: number) {
    const data = this.siteIdentityData();
    return data?.products?.find((product: any) => product.id === id);
  }

  //#endregion
}
