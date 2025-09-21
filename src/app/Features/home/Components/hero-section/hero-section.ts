import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css'
})
export class HeroSection {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getHeroCompanyName(): string {
    return this.languageService.getText('companyName', '');
  }
  getHeroMainTitle(): string {
    return this.languageService.getText('hero_mainTitle', '');
  }

  getHeroSubtitle(): string {
    return this.languageService.getText('hero_subtitle', '');
  }

  getHeroArabicBadge(): string {
    return this.languageService.getText('hero_arabicBadge', '');
  }
  getHeroProductFilterLabel(): string {
    return this.languageService.getText('hero_productFilter_label', '');
  }
  getHeroMission(): string {
    return this.languageService.getText('hero_mission', '');
  }

  getHeroKeepInTouch(): string {
    return this.languageService.getText('clientFamily_button', '');
  }
  
}
