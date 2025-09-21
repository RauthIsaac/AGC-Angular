import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../services/NavigationService/navigation-service';
import { LanguageService } from '../../Core/Services/language-service/language-service';
import { API_URL } from '../../Constants/api-endpoints';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  // Inject services using modern Angular inject function
  private navigationService = inject(NavigationService);
  private languageService = inject(LanguageService);

  // Keep only the activeSection input as it's navigation-specific
  @Input() activeSection: string = 'home';

  constructor() {}

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
   * Switch to specific language
   */
  switchToLanguage(languageCode: string) {
    this.languageService.setLanguage(languageCode);
  }

  /**
   * Get current language info
   */
  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  get currentLanguageName(): string {
    return this.languageService.getCurrentLanguageName();
  }

  get currentLanguageFlag(): string {
    return this.languageService.getCurrentLanguageFlag();
  }

  get isRTL(): boolean {
    return this.languageService.isRTL();
  }

  get isLoading(): boolean {
    return this.languageService.isLoading();
  }

  //#endregion

  /*====================================================================*/
  //#region Helper Methods for Template

  /**
   * Get company name with fallback
   */
  getCompanyName(): string {
    return this.languageService.getText('companyName', 'AGC Lubricants');
  }

  /**
   * Get company logo URL with fallback
   */
  getLogoUrl(): string {
    return API_URL + this.languageService.getText('logoUrl', 'AGC Lubricants');;
  }

  /**
   * Check if site data is available
   */
  hasSiteData(): boolean {
    return this.languageService.getCurrentSiteData() !== null && !this.isLoading;
  }

  /*------------- Get phone number based on language -------------*/
  getPhoneNumber(): string {
    return this.languageService.getText('header_phone');
  }

  /*------------- Get email based on language -------------*/
  getEmail(): string {
    return this.languageService.getText('header_email', 'info@agc.com');
  }

  /*------------- Get company tagline based on language -------------*/
  getTagline(): string {
    const fallbackEn = 'Powering industries with premium Mobil lubricants since 2000';
    const fallbackAr = 'نقدم زيوت موبيل المتميزة للصناعات منذ عام 2000';
    
    if (this.isRTL) {
      return fallbackAr;
    }
    return fallbackEn;
  }

  /*------------- Get distributor text based on language -------------*/
  getDistributorText(): string {
    const fallbackEn = 'ExxonMobil Authorized Distributor';
    const fallbackAr = 'الموزع المعتمد لشركة إكسون موبيل';
    
    if (this.isRTL) {
      return fallbackAr;
    }
    return fallbackEn;
  }

  /*------------- Get Home based on language -------------*/
  getHome(): string {
    return this.languageService.getText('header_navigation_home');
  }

  /*------------- Get About based on language -------------*/
  getAbout(): string {
    return this.languageService.getText('header_navigation_about');
  }

  /*------------- Get Products based on language -------------*/
  getProducts(): string {
    return this.languageService.getText('header_navigation_products');
  }

  /*------------- Get Clients based on language -------------*/
  getClients(): string {
    return this.languageService.getText('header_navigation_clients');
  }

  /*------------- Get News based on language -------------*/
  getNews(): string {
    return this.languageService.getText('header_navigation_news');
  }

  /*------------- Get Contact based on language -------------*/
  getContact(): string {
    return this.languageService.getText('header_navigation_contact');
  }

  //#endregion
}