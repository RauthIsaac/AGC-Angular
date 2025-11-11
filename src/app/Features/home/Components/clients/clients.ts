import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, PLATFORM_ID, HostListener } from '@angular/core';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { ClientImageService } from '../../../../Core/Services/client-image-service/client-image-service';
import { ClientImage } from '../../../../Shared/models/client-image';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-clients',
  imports: [NgClass, CommonModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css'
})
export class Clients implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private languageService = inject(LanguageService);
  private clientImageService = inject(ClientImageService);

  // Client images from API
  clientImages: ClientImage[] = [];
  isLoadingImages = true;

  // Current screen size state
  currentScreenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  imagesPerSlide: number = 6;

  constructor() {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectScreenSize();
    }
    this.loadClientImages();
  }

  loadClientImages() {
    this.isLoadingImages = true;
    
    // Try public access first
    this.clientImageService.getPublicClientImages().subscribe({
      next: (images) => {
        this.clientImages = images || [];
        this.isLoadingImages = false;
      },
      error: (publicError) => {
        // If public access fails, try authenticated access
        this.clientImageService.getAllClientImages().subscribe({
          next: (images) => {
            this.clientImages = images || [];
            this.isLoadingImages = false;
          },
          error: (authError) => {
            console.error('Error loading client images (both public and auth failed):', authError);
            this.isLoadingImages = false;
            
            // Fallback to language service if both API methods fail
            try {
              const fallbackImages = this.languageService.getArrayData('client_Images');
              this.clientImages = fallbackImages.map((item: any, index: number) => ({
                id: index + 1,
                image_Url: item.image_Url
              }));
            } catch (e) {
              // If fallback also fails, set empty array
              this.clientImages = [];
            }
          }
        });
      }
    });
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
  getGroupedClients(): ClientImage[][] {
    const grouped: ClientImage[][] = [];
    for (let i = 0; i < this.clientImages.length; i += this.imagesPerSlide) {
      grouped.push(this.clientImages.slice(i, i + this.imagesPerSlide));
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

  // Get client image URL with proper server path
  getClientImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it starts with /, it's a server path
    if (imageUrl.startsWith('/')) {
      return `${environment.apiUrl}${imageUrl}`;
    }
    
    // Otherwise, assume it's a relative path
    return `${environment.apiUrl}/${imageUrl}`;
  }


  // Get carousel interval based on screen size (slower for mobile)
  getCarouselInterval(): number {
    return this.currentScreenSize === 'xs' || this.currentScreenSize === 'sm' ? 4000 : 3000;
  }
}