import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { API_URL } from '../../../Constants/api-endpoints';
import { Loading } from "../../../Shared/loading/loading";

@Component({
  selector: 'app-news-details',
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './news-details.html',
  styleUrl: './news-details.css'
})
export class NewsDetails implements OnInit, OnDestroy {
  // Inject services using modern Angular inject function
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  newsItem: any = null;
  newsId: string | null = null;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    // Subscribe to route params
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        this.newsId = params.get('id');
        // //console.log('News ID from route:', this.newsId);
        if (this.newsId) {
          this.loadNewsDetails();
        } else {
          this.router.navigate(['/news']);
        }
      })
    );

    // Subscribe to site data changes from LanguageService
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(data => {
        // //console.log('Site data updated in news details:', data);
        if (this.newsId) {
          this.loadNewsDetails();
        }
      })
    );

    // Subscribe to loading state
    this.subscription.add(
      this.languageService.isLoading$.subscribe(loading => {
        if (!loading && this.newsId) {
          this.loadNewsDetails();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadNewsDetails(): void {
    this.isLoading = true;
    // //console.log('Loading news details for ID:', this.newsId);

    const siteData = this.languageService.getCurrentSiteData();
    
    if (siteData && siteData.news) {
      // Find the news item by ID
      this.newsItem = siteData.news.find((item: any) => {
        return String(item.id) === String(this.newsId);
      });
      
      this.isLoading = false;
      
      if (!this.newsItem) {
        // console.warn('No news item found for ID:', this.newsId);
        // //console.log('Available news IDs:', siteData.news.map((item: any) => item.id));
        this.router.navigate(['/news']);
      } else {
        // //console.log('News item loaded:', this.newsItem);
      }
    } else {
      // console.warn('Site data or news array not available yet for ID:', this.newsId);
      // Check if we're still loading
      if (!this.languageService.isLoading()) {
        this.isLoading = false;
        this.router.navigate(['/news']);
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

  getBackToNewsText(): string {
    return this.isRTL() ? 'العودة للأخبار' : 'Back to News';
  }

  getNewsNotFoundText(): string {
    return this.isRTL() ? 'الخبر غير موجود!' : 'News Not Found!';
  }

  getNewsNotFoundMessage(): string {
    return this.isRTL() 
      ? 'لم يتم العثور على المقال المطلوب.'
      : 'The requested news article could not be found.';
  }

  getLoadingText(): string {
    return this.isRTL() ? 'جاري تحميل تفاصيل الخبر...' : 'Loading news details...';
  }

  // Format date for the news item
  getFormattedDate(dateString?: string): string {
    if (!dateString && this.newsItem?.createdDate) {
      dateString = this.newsItem.createdDate;
    }
    
    if (!dateString) return '';

    const date = new Date(dateString);
    const locale = this.isRTL() ? 'ar-SA' : 'en-US';
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get news image with fallback
  getNewsImage(): string {
    const imageUrl = API_URL + this.newsItem?.newsImgUrl;
    return imageUrl;
  }
}