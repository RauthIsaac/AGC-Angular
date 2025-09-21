import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getAboutTitle(): string {
    return this.languageService.getText('about_title', '');
  }

  getAboutSubtitle(): string {
    return this.languageService.getText('about_subtitle', '');
  }

  getAboutDescription(): string {
    return this.languageService.getText('about_description', '');
  }

  getAboutOurMission(): string {
    return this.languageService.getText('about_ourMission', '');
  }

  getAboutMissionStatement(): string {
    return this.languageService.getText('about_missionStatement', '');
  }

  getAboutOurVision(): string {
    return this.languageService.getText('about_ourVision', '');
  }

  getAboutVisionStatement(): string {
    return this.languageService.getText('about_visionStatement', '');
  }

  getAboutStatsYearsExperience(): string {
    return this.languageService.getText('about_stats_yearsExperience', '');
  }

  getAboutStatsSpecialists(): string {
    return this.languageService.getText('about_stats_specialists', '');
  }

  getAboutStatsSpecializedProducts(): string {
    return this.languageService.getText('about_stats_specializedProducts', '');
  }

  getAboutStatsTechnicalSupport(): string {
    return this.languageService.getText('about_stats_technicalSupport', '');
  }

  getAboutAuthorizedCompany(): string {
    return this.languageService.getText('about_stats_authorizedCompany', '');
  }

  getAboutStatsAuthorizedDistributor(): string {
    return this.languageService.getText('about_stats_authorizedDistributor', '');
  }  

}
