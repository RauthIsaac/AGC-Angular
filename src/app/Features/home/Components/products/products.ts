import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from "../../../products/product-card/product-card";
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [ProductCard, CommonModule],
  standalone: true,
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit, OnDestroy {

  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);
  private subscription = new Subscription();

  productsList: any[] = [];

  constructor() { }

  ngOnInit() {
    // Subscribe to site data changes
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(siteData => {
        // console.log("Site Data changed in Products component:", siteData);
        this.getProductsList(siteData);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

   private getProductsList(siteData: any) {
    // console.log('Raw siteData:', siteData); 

    if (siteData && siteData.products) {
      this.productsList = Array.isArray(siteData.products) ? siteData.products : [];
      // console.log('Final Products List:', this.productsList);
    } else {
      this.productsList = [];
      // console.log('No products data available.');
    }
  }

  // Helper methods for template
  isLoading(): boolean {
    return this.languageService.isLoading();
  }

  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  hasProducts(): boolean {
    return this.productsList.length > 0;
  }


  getProductTitle():string{
    return this.languageService.getText('products_title', 'products_title');
  }

  getProductDescription():string{
    return this.languageService.getText('products_description', 'products_description');
  }

  getProductButton():string{
    return this.languageService.getText('products_button', 'products_button');
  }

  getNoProductsText(): string {
    return this.languageService.getText(
      'no_products', 
      this.isRTL() ? 'لا توجد منتجات متاحة حالياً.' : 'No products available at the moment.'
    );
  }

}
