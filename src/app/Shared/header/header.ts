// header.ts - Updated Header Component
import { Component, Input, computed } from '@angular/core';
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
  // Input properties - receive data from parent
  @Input() siteData: any = null;
  @Input() currentLanguage: string = 'en';
  @Input() isRTL: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() currentLanguageName: string = 'English';
  @Input() currentLanguageFlag: string = '🇺🇸';
  @Input() activeSection: string = 'home';

  constructor(
    private navigationService: NavigationService,
    private languageService: LanguageService
  ) {}

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
   * Get text using fallback for missing data
   */
  getText(key: string, fallback?: string): string {
    if (!this.siteData) return fallback || key;
    return this.siteData[key] || fallback || key;
  }

  //#endregion

  /*====================================================================*/
  //#region Helper Methods for Template

  /**
   * Get company name with fallback
   */
  getCompanyName(): string {
    return this.siteData?.companyName || 'AGC Lubricants';
  }

  /**
   * Get company logo URL with fallback
   */
  getLogoUrl(): string {
    return this.siteData?.logoUrl;
  }

  /**
   * Check if site data is available
   */
  hasSiteData(): boolean {
    return this.siteData !== null && !this.isLoading;
  }

  /**
   * Get phone number based on language
   */
  getPhoneNumber(): string {
    return this.siteData?.phoneNumber || '+1 (555) 123-4567';
  }

  /**
   * Get email based on language
   */
  getEmail(): string {
    return this.siteData?.email || 'info@agc.com';
  }

  /**
   * Get company tagline based on language
   */
  getTagline(): string {
    if (this.isRTL) {
      return this.siteData?.taglineAr || 'نقدم زيوت موبيل المتميزة للصناعات منذ عام 2000';
    }
    return this.siteData?.taglineEn || 'Powering industries with premium Mobil lubricants since 2000';
  }

  /**
   * Get distributor text based on language
   */
  getDistributorText(): string {
    if (this.isRTL) {
      return this.siteData?.distributorTextAr || 'الموزع المعتمد لشركة إكسون موبيل';
    }
    return this.siteData?.distributorTextEn || 'ExxonMobil Authorized Distributor';
  }

  //#endregion

}