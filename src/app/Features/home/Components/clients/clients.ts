import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, HostListener } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-clients',
  imports: [NgClass, CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private languageService = inject(LanguageService);

  // Current screen size state
  currentScreenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  imagesPerSlide: number = 6;

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

  constructor() {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectScreenSize();
    }
  }

  ngOnDestroy() {}

  // Listen to window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.detectScreenSize();
    }
  }

  // Detect current screen size and set images per slide accordingly
  private detectScreenSize() {
    const width = window.innerWidth;
    
    if (width < 576) {
      this.currentScreenSize = 'xs';
      this.imagesPerSlide = 1; // موبايل صغير: صورة واحدة
    } else if (width < 768) {
      this.currentScreenSize = 'sm';
      this.imagesPerSlide = 2; // موبايل كبير: صورتين
    } else if (width < 992) {
      this.currentScreenSize = 'md';
      this.imagesPerSlide = 3; // تابلت: 3 صور
    } else if (width < 1200) {
      this.currentScreenSize = 'lg';
      this.imagesPerSlide = 4; // شاشة متوسطة: 4 صور
    } else {
      this.currentScreenSize = 'xl';
      this.imagesPerSlide = 6; // شاشة كبيرة: 6 صور
    }
  }

  // Group clients based on current screen size
  getGroupedClients(): string[][] {
    const grouped: string[][] = [];
    for (let i = 0; i < this.clientsList.length; i += this.imagesPerSlide) {
      grouped.push(this.clientsList.slice(i, i + this.imagesPerSlide));
    }
    return grouped;
  }

  // Get Bootstrap column class based on images per slide
  getColumnClass(): string {
    const colSize = Math.floor(12 / this.imagesPerSlide);
    return `col-${colSize}`;
  }

  // Get responsive classes for images
  getImageClasses(): string {
    const baseClasses = 'client-img';
    
    switch (this.currentScreenSize) {
      case 'xs':
        return `${baseClasses} img-xs`;
      case 'sm':
        return `${baseClasses} img-sm`;
      case 'md':
        return `${baseClasses} img-md`;
      case 'lg':
        return `${baseClasses} img-lg`;
      default:
        return `${baseClasses} img-xl`;
    }
  }

  // Helper methods for template
  getClientsTitle(): string {
    return this.languageService.getText('clients_title', 'Our Clients');
  }

  getClientsDescription(): string {
    return this.languageService.getText(
      'clients_description', 
      'We are proud of the trust of our clients from various sectors in the Kingdom of Saudi Arabia.'
    );
  }

  getClientsMessage(): string {
    return this.languageService.getText(
      'clients_message', 
      'More than 500 clients trust us throughout the Kingdom'
    );
  }

  // Get carousel interval based on screen size (slower for mobile)
  getCarouselInterval(): number {
    return this.currentScreenSize === 'xs' || this.currentScreenSize === 'sm' ? 4000 : 3000;
  }
}