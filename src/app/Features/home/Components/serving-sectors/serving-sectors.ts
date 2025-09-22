import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-serving-sectors',
  imports: [],
  templateUrl: './serving-sectors.html',
  styleUrl: './serving-sectors.css'
})
export class ServingSectors {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  // Helper methods for template - now using LanguageService directly
  getClientsSectorsTitle(): string {
    return this.languageService.getText('clients_sectorsTitle', 'clients_sectorsTitle');
  }

  getClientsSectorsName1(): string {
    return this.languageService.getText('clients_sectors_name_1', 'clients_sectors_name_1');
  }
  getClientsSectorsDescription1(): string {
    return this.languageService.getText('clients_sectors_description_1', 'clients_sectors_description_1');
  }

  getClientsSectorsName2(): string {
    return this.languageService.getText('clients_sectors_name_2', 'clients_sectors_name_2');
  }
  getClientsSectorsDescription2(): string {
    return this.languageService.getText('clients_sectors_description_2', 'clients_sectors_description_2');
  }

  getClientsSectorsName3(): string {
    return this.languageService.getText('clients_sectors_name_3', 'clients_sectors_name_3');
  }
  getClientsSectorsDescription3(): string {
    return this.languageService.getText('clients_sectors_description_3', 'clients_sectors_description_3');
  }


  getClientsSectorsName4(): string {
    return this.languageService.getText('clients_sectors_name_4', 'clients_sectors_name_4');
  }
  getClientsSectorsDescription4(): string {
    return this.languageService.getText('clients_sectors_description_4', 'clients_sectors_description_4');
  }

  getClientsSectorsName5(): string {
    return this.languageService.getText('clients_sectors_name_5', 'clients_sectors_name_5');
  }
  getClientsSectorsDescription5(): string {
    return this.languageService.getText('clients_sectors_description_5', 'clients_sectors_description_5');
  }

  getClientsSectorsName6(): string {
    return this.languageService.getText('clients_sectors_name_6', 'clients_sectors_name_6');
  }
  getClientsSectorsDescription6(): string {
    return this.languageService.getText('clients_sectors_description_6', 'clients_sectors_description_6');
  }

  getClientFamilyTitle(): string {
    return this.languageService.getText('clientFamily_title', 'clientFamily_title');
  }
  getClientFamilyDescription(): string {
    return this.languageService.getText('clientFamily_description', 'clientFamily_description');
  }
  getClientFamilyButton(): string {
    return this.languageService.getText('clientFamily_button', 'clientFamily_button');
  }
  
}
