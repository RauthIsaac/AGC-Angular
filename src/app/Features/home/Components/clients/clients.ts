import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';

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

  getGroupedClients(): string[][] {
    const grouped: string[][] = [];
    for (let i = 0; i < this.clientsList.length; i += 6) {
      grouped.push(this.clientsList.slice(i, i + 6));
    }
    return grouped;
  }

}
