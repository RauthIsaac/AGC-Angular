import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { Subscription } from 'rxjs';
import { API_URL } from '../../../Constants/api-endpoints';
import { Products } from "../../home/Components/products/products";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [ Products, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnDestroy {

  // Inject services using modern Angular inject function
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  productItem: any = null;
  productId: string | null = null;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Subscribe to route params
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        this.productId = params.get('id');
        // //console.log('Product ID from route:', this.productId);
        if (this.productId) {
          this.loadProductDetails();
        } else {
          this.router.navigate(['/products']);
        }
      })
    );

    // Subscribe to site data changes from LanguageService
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(data => {
        // //console.log('Site data updated in product details:', data);
        if (this.productId) {
          this.loadProductDetails();
        }
      })
    );

    // Subscribe to loading state
    this.subscription.add(
      this.languageService.isLoading$.subscribe(loading => {
        if (!loading && this.productId) {
          this.loadProductDetails();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadProductDetails(): void {
    this.isLoading = true;
    // //console.log('Loading product details for ID:', this.productId);

    const siteData = this.languageService.getCurrentSiteData();
    
    if (siteData && siteData.products) {
      // Find the product item by ID
      this.productItem = siteData.products.find((item: any) => {
        return String(item.id) === String(this.productId);
      });
      
      this.isLoading = false;
      
      if (!this.productItem) {
        // console.warn('No product item found for ID:', this.productId);
        // //console.log('Available product IDs:', siteData.products.map((item: any) => item.id));
        this.router.navigate(['/products']);
      } else {
        // //console.log('Product item loaded:', this.productItem);
      }
    } else {
      // console.warn('Site data or product array not available yet for ID:', this.productId);
      // Check if we're still loading
      if (!this.languageService.isLoading()) {
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    }
  }


  // Helper methods for template
  isRTL(): boolean {
    return this.languageService.isRTL();
  } 

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  getProductImage(): string {
    const imageUrl = API_URL + this.productItem?.imageUrl;
    return imageUrl;
  }

  getProductName(): string {
    return this.productItem?.name || 'product_name';
  }

  getProductTitle(): string {
    return this.productItem?.title || 'product_title';
  }

  getProductSubtitle(): string {
    return this.productItem?.subTitle || 'product_subtitle';
  }

  getProductDescription(): string {
    return this.productItem?.description || 'product_description';
  }

  getProductBenefitTitle_1(): string {
    return this.productItem?.benefit_Title_1 || 'benefit_title_1';
  }

  getProductBenefitDescription_1(): string {
    return this.productItem?.benefit_Description_1 || 'benefit_description_1';
  }

  getProductBenefitTitle_2(): string {
    return this.productItem?.benefit_Title_2 || 'benefit_title_2';
  }

  getProductBenefitDescription_2(): string {
    return this.productItem?.benefit_Description_2 || 'benefit_description_2';
  }

  getProductBenefitTitle_3(): string {
    return this.productItem?.benefit_Title_3 || 'benefit_title_3';
  }

  getProductBenefitDescription_3(): string {
    return this.productItem?.benefit_Description_3 || 'benefit_description_3';
  }

  getProductBenefitTitle_4(): string {
    return this.productItem?.benefit_Title_4 || 'benefit_title_4';
  }

  getProductBenefitDescription_4(): string {
    return this.productItem?.benefit_Description_4 || 'benefit_description_4';
  }

  getProductApplicationList(): string[] {
    const apps = this.productItem?.applicationsList; 
    return apps ? apps.split(/[,،;؛]/).map((a: string) => a.trim()) : [];
  }

  getWhyChooseStatement(): string {
    return this.productItem?.why_Choose_Statement || 'why_choose_statement';
  } 

  getWhyChooseList(): string {
    return (this.productItem?.why_Choose_List).split(/[;,،؛]/) || ['why_choose_list'];
  }

  getApplicationsTitle(): string {
    return this.languageService.getText('product_applications', 'product_applications');
  }

  getApplicationsStatement(): string {
    return this.languageService.getText('product_applications_statement', 'product_applications_statement');
  }

  getKeyBenefitsTitle(): string {
    return this.languageService.getText('product_keyBenefits', 'product_keyBenefits');
  }

  getKeyBenefitsStatement(): string {
    return this.languageService.getText('product_keyBenefits_statement', 'product_keyBenefits_statement');
  }

  getWhyChooseTitle(): string {
    return this.languageService.getText('product_why_choose', 'product_why_choose');
  }

}
