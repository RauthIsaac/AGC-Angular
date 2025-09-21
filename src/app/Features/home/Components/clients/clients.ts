import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-clients',
  imports: [NgClass,CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients {

  clientsList = [
    '/Images/Clients/1.jpeg',
    '/Images/Clients/2.jpeg',
    '/Images/Clients/3.jpeg',
    '/Images/Clients/4.jpeg',
    '/Images/Clients/5.jpeg',
    '/Images/Clients/6.jpeg',
    '/Images/Clients/7.jpeg',
    '/Images/Clients/8.jpeg',
    '/Images/Clients/9.jpeg',
    '/Images/Clients/10.jpeg',
    '/Images/Clients/11.jpeg',
    '/Images/Clients/12.jpeg',
    '/Images/Clients/13.jpeg',
    '/Images/Clients/14.jpeg',
    '/Images/Clients/15.jpeg',
    '/Images/Clients/16.jpeg',
    '/Images/Clients/17.jpeg',
    '/Images/Clients/18.jpeg',
    '/Images/Clients/19.jpeg',
    '/Images/Clients/20.jpeg',
    '/Images/Clients/21.jpeg',
  ];


  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);

  constructor() { }

  /*------- To Select Images Number --------*/
  getGroupedClients(): string[][] {
    const grouped: string[][] = [];
    for (let i = 0; i < this.clientsList.length; i += 6) {
      grouped.push(this.clientsList.slice(i, i + 6));
    }
    return grouped;
  }


  // Helper methods for template - now using LanguageService directly
  getClientsTitle(): string {
    return this.languageService.getText('clients_title', '');
  }

  getClientsDescription(): string {
    return this.languageService.getText('clients_description', '');
  }

  getClientsMessage(): string {
    return this.languageService.getText('clients_message', '');
  }   

}
