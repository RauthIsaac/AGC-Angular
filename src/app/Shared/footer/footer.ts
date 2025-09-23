import { Component, inject } from '@angular/core';
import { LanguageService } from '../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getFooterCompanyName(): string {
    return this.languageService.getText('companyName', 'companyName');
  }
  getFooterCompanyDescription(): string {
    return this.languageService.getText('footer_companyDescription', 'footer_companyDescription');
  }

  getFooterQuickLinks(): string {
    return this.languageService.getText('footer_quickLinks', 'footer_quickLinks');
  }
  getFooterCopyright(): string {
    return this.languageService.getText('footer_copyright', 'footer_copyright');
  }
  getFooterContactInfo(): string {
    return this.languageService.getText('footer_contactInfo', 'footer_contactInfo');
  }

  getFooterSocialMediaLinks(): string {
    return this.languageService.getText('footer_socialMedia', 'footer_socialMedia');
  }
  getFooterSocialMediaFacebookUrl(): string {
    return this.languageService.getText('footer_socialMedia_facebookUrl', 'footer_socialMedia_facebookUrl');
  }
  getFooterSocialMediaTiktokUrl(): string {
    return this.languageService.getText('footer_socialMedia_tiktokUrl', 'footer_socialMedia_tiktokUrl');
  }
  getFooterSocialMediaLinkedinUrl(): string {
    return this.languageService.getText('footer_socialMedia_linkedinUrl', 'footer_socialMedia_linkedinUrl');
  }
  getFooterSocialMediaInstagramUrl(): string {
    return this.languageService.getText('footer_socialMedia_instagramUrl', 'footer_socialMedia_instagramUrl');
  }

  /*------------- Get Home based on language -------------*/
  getHome(): string {
    return this.languageService.getText('header_navigation_home', 'header_navigation_home');
  }

  /*------------- Get About based on language -------------*/
  getAbout(): string {
    return this.languageService.getText('header_navigation_about', 'header_navigation_about');
  }

  /*------------- Get Products based on language -------------*/
  getProducts(): string {
    return this.languageService.getText('header_navigation_products', 'header_navigation_products');
  }

  /*------------- Get Clients based on language -------------*/
  getClients(): string {
    return this.languageService.getText('header_navigation_clients', 'header_navigation_clients');
  }

  /*------------- Get News based on language -------------*/
  getNews(): string {
    return this.languageService.getText('header_navigation_news', 'header_navigation_news');
  }

  /*------------- Get Contact based on language -------------*/
  getContact(): string {
    return this.languageService.getText('header_navigation_contact', 'header_navigation_contact');
  }

  getFooterPhone(): string {
    return this.languageService.getText('footer_contactInfoList_phone', 'footer_contactInfoList_phone');
  }

  getFooterEmail(): string {
    return this.languageService.getText('footer_contactInfoList_email', 'footer_contactInfoList_email');
  }
  getFooterAddress(): string {
    return this.languageService.getText('footer_contactInfoList_address', 'footer_contactInfoList_address');
  }


  getFooterAuthorizedDistributor(): string {
    return this.languageService.getText('header_distributed', 'footer_distributed');
  }

  getCompanyLocation(): string {
    return this.languageService.getText('contact_info_Location', 'contact_info_Location');
  }
}

