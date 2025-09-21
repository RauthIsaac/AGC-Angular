import { Component, inject, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { API_URL } from '../../../Constants/api-endpoints';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../Shared/Pipes/TruncatePipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, TruncatePipe, RouterLink],
  standalone: true,
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard implements OnInit{

  // Keep the product input as it's specific data for this card
  @Input({ required: true }) product!: any;
  
  // Inject language service for language-related functionality
  private languageService = inject(LanguageService);

  constructor() { }

  ngOnInit(): void {
    if (this.product) {
      console.log('Product data received in ProductCard:', this.product);
    }
  }

  // Helper methods for template
  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }


  // Get product image with fallback
  getProductImage(): string {
    const productImageURL = API_URL + this.product?.imageUrl;
    return productImageURL ;
  }


}
