import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { NgStyle } from '@angular/common';
import { API_URL } from '../../../../Constants/api-endpoints';

@Component({
  selector: 'app-hero-section',
  imports: [NgStyle],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getHeroCompanyName(): string {
    return this.languageService.getText('companyName', 'companyName');
  }
  getHeroMainTitle(): string {
    return this.languageService.getText('hero_mainTitle', 'hero_mainTitle');
  }

  getHeroSubtitle(): string {
    return this.languageService.getText('hero_subtitle', 'hero_subtitle');
  }

  getHeroArabicBadge(): string {
    return this.languageService.getText('hero_arabicBadge', 'hero_arabicBadge');
  }
  getHeroProductLabel(): string {
    return this.languageService.getText('header_navigation_products', 'header_navigation_products');
  }
  getHeroMission(): string {
    return this.languageService.getText('hero_mission', 'hero_mission');
  }

  getHeroKeepInTouch(): string {
    return this.languageService.getText('clientFamily_button', 'clientFamily_button');
  }
  
  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getHeroBackgroundImage(): string {
    const coverURL = API_URL + this.languageService.getText('coverImgUrl', 'coverImgUrl');
    return coverURL;
  }


}
