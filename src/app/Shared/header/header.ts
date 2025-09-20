import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../services/NavigationService/navigation-service';
import { LanguageService } from '../../Core/Services/language-service/language-service';

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
    return './Images/logo.jpeg';
  }

  /**
   * Check if site data is available
   */
  hasSiteData(): boolean {
    return this.languageService.getCurrentSiteData() !== null && !this.isLoading;
  }

  /**
   * Get phone number based on language
   */
  getPhoneNumber(): string {
    return '+1 (555) 123-4567';

  }

  /**
   * Get email based on language
   */
  getEmail(): string {
    return'info@agc.com';
  }

  /**
   * Get company tagline based on language
   */
  getTagline(): string {
    const fallbackEn = 'Powering industries with premium Mobil lubricants since 2000';
    const fallbackAr = 'نقدم زيوت موبيل المتميزة للصناعات منذ عام 2000';
    
    if (this.isRTL) {
      return fallbackAr;
    }
    return fallbackEn;
  }

  /**
   * Get distributor text based on language
   */
  getDistributorText(): string {
    const fallbackEn = 'ExxonMobil Authorized Distributor';
    const fallbackAr = 'الموزع المعتمد لشركة إكسون موبيل';
    
    if (this.isRTL) {
      return fallbackAr;
    }
    return fallbackEn;
  }

  /**
   * Get navigation text based on language
   */
  getNavText(key: string): string {
    const navTexts: { [key: string]: { en: string, ar: string } } = {
      home: { en: 'Home', ar: 'الرئيسية' },
      news: { en: 'News', ar: 'الأخبار' },
      products: { en: 'Products', ar: 'المنتجات' },
      about: { en: 'About Us', ar: 'حول الشركة' },
      contact: { en: 'Contact Us', ar: 'تواصل معنا' }
    };

    const lang = this.isRTL ? 'ar' : 'en';
    return navTexts[key]?.[lang] || key;
  }

  //#endregion
}