import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-ceo',
  imports: [CommonModule],
  templateUrl: './ceo.html',
  styleUrl: './ceo.css'
})
export class Ceo {
  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getCeoName(): string {
    return this.languageService.getText('ceO_Name', '');
  }

  getCeoTitle(): string {
    return this.languageService.getText('ceO_JobTitle', '');
  }

  getIntroMessage(): string {
    return this.languageService.getText('ceO_IntroMessage', '');
  }

  getEndMessage(): string {
    return this.languageService.getText('ceO_EndMessage', '');
  }

  hasData(): boolean {
    return this.languageService.getCurrentSiteData() !== null && !this.isLoading();
  }

  isLoading(): boolean {
    return this.languageService.isLoading();
  }

  // Additional helper methods
  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
}