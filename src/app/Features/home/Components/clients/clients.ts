import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, HostListener } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { API_URL } from '../../../../Constants/api-endpoints';

@Component({
  selector: 'app-clients',
  imports: [NgClass, CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private languageService = inject(LanguageService);

  // API_URL
  API_URL = API_URL;

  // Current screen size state
  currentScreenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  imagesPerSlide: number = 6;

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
    for (let i = 0; i < this.getClientsImages().length; i += this.imagesPerSlide) {
      grouped.push(this.getClientsImages().slice(i, i + this.imagesPerSlide));
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
    return this.languageService.getText('clients_title', 'clinets_title');
  }

  getClientsDescription(): string {
    return this.languageService.getText('clients_description', 'clients_description');
  }

  getClientsMessage(): string {
    return this.languageService.getText('clients_message', 'clients_message');
  }

  getClientsImages(): string[] {
    return this.languageService
            .getArrayData('client_Images')
            .map((item: any) => item.image_Url);
  }


  // Get carousel interval based on screen size (slower for mobile)
  getCarouselInterval(): number {
    return this.currentScreenSize === 'xs' || this.currentScreenSize === 'sm' ? 4000 : 3000;
  }
}