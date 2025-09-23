import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { API_URL } from '../../../../Constants/api-endpoints';
import { Loading } from "../../../../Shared/loading/loading";

@Component({
  selector: 'app-ceo',
  imports: [CommonModule, Loading],
  templateUrl: './ceo.html',
  styleUrl: './ceo.css'
})
export class Ceo {
  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  // API_Url
  API_URL = API_URL;
  
  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getCeoMessageTitle(): string {
    return this.languageService.getText('ceoMessage_title', 'ceoMessage_title');
  }

  getCeoMessageVisionStatement(): string {
    return this.languageService.getText('ceoMessage_visionStatement', 'ceoMessage_visionStatement');
  }

  getCeoName(): string {
    return this.languageService.getText('ceoMessage_ceoName', 'ceoMessage_ceoName');
  }

  getCeoTitle(): string {
    return this.languageService.getText('ceoMessage_position', 'ceoMessage_position');
  }

  getCeoImageUrl(): string {
    return API_URL +this.languageService.getText('ceoMessage_ceoImageUrl', 'ceoMessage_ceoImageUrl');
  } 

  getIntroMessage(): string {
    return this.languageService.getText('ceO_IntroMessage', 'ceO_IntroMessage');
  }

  getEndMessage(): string {
    return this.languageService.getText('ceO_EndMessage', 'ceO_EndMessage');
  }

  getCeoQualifications(): string[] {
    const ceoQualifications = this.languageService.getText('ceoMessage_ceoQualifications', 'ceoMessage_ceoQualifications');
    return ceoQualifications? ceoQualifications.split(/[,،;؛]/) : ['ceoMessage_ceoQualifications'];
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