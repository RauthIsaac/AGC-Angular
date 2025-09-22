import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-values',
  imports: [],
  templateUrl: './values.html',
  styleUrl: './values.css'
})
export class Values {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getValuesTitle(): string {
    return this.languageService.getText('values_title', 'values_title');
  }

  getValuesPrincipleTitle1(): string {
    return this.languageService.getText('values_principles_title_1', 'values_principles_title_1');
  }

  getValuesPrincipleTitle2(): string {
    return this.languageService.getText('values_principles_title_2', 'values_principles_title_2');
  }

  getValuesPrincipleTitle3(): string {
    return this.languageService.getText('values_principles_title_3', 'values_principles_title_3');
  }

  getValuesPrincipleTitle4(): string {
    return this.languageService.getText('values_principles_title_4', 'values_principles_title_4');
  }

  getValuesPrincipleTitle5(): string {
    return this.languageService.getText('values_principles_title_5', 'values_principles_title_5');
  }

  getValuesPrincipleTitle6(): string {
    return this.languageService.getText('values_principles_title_6', 'values_principles_title_6');
  }

  getValuesPrincipleDescription1(): string {
    return this.languageService.getText('values_principles_description_1', 'values_principles_description_1');
  }

  getValuesPrincipleDescription2(): string {
    return this.languageService.getText('values_principles_description_2', 'values_principles_description_2');
  }

  getValuesPrincipleDescription3(): string {
    return this.languageService.getText('values_principles_description_3', 'values_principles_description_3');
  }

  getValuesPrincipleDescription4(): string {
    return this.languageService.getText('values_principles_description_4', 'values_principles_description_4');
  }

  getValuesPrincipleDescription5(): string {
    return this.languageService.getText('values_principles_description_5', 'values_principles_description_5');
  }

  getValuesPrincipleDescription6(): string {
    return this.languageService.getText('values_principles_description_6', 'values_principles_description_6');
  }
}
