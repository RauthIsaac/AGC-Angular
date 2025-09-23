import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NewsCard } from '../../../news/news-card/news-card';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [NewsCard, CommonModule],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class News implements OnInit, OnDestroy {
  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private subscription = new Subscription();

  newsList: any[] = [];
  newsPerSlide: number = 1; // Changed to 1 to show one news item per slide
  loading: boolean = false;

  constructor() { }

  ngOnInit() {
    this.loading = true;
    
    // Subscribe to site data changes
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(siteData => {
        console.log("Site Data changed in News component:", siteData);
        this.getNewsList(siteData);
        this.loading = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Extract news list from site data
   */
  private getNewsList(siteData: any): void {
    console.log('Raw siteData:', siteData); 
    
    if (siteData && siteData.news) {
      this.newsList = Array.isArray(siteData.news) ? siteData.news : [];
      console.log('Final News List:', this.newsList);
    } else {
      this.newsList = [];
      console.log('No news data available.');
    }
  }

  /**
   * Check if component is in loading state
   */
  isLoading(): boolean {
    return this.languageService.isLoading() || this.loading;
  }

  /**
   * Check if current language is RTL
   */
  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  /**
   * Check if there are news items available
   */
  hasNews(): boolean {
    return this.newsList && this.newsList.length > 0;
  }

  /**
   * Get news section title
   */
  getNewsTitle(): string {
    return this.languageService.getText('news_title', 'Latest News');
  }

  /**
   * Get news section description
   */
  getNewsDescription(): string {
    return this.languageService.getText('news_description', 'Stay updated with our latest news and updates');
  }

  /**
   * Get news button text
   */
  getNewsButton(): string {
    return this.languageService.getText('news_button', 'View All News');
  }

  /**
   * Get text for when no news is available
   */
  getNoNewsText(): string {
    return this.languageService.getText(
      'no_news', 
      this.isRTL() ? 'لا توجد أخبار متاحة حالياً.' : 'No news available at the moment.'
    );
  }

  /**
   * Group news items based on newsPerSlide for carousel
   */
  getGroupedNews(): any[][] {
    if (!this.hasNews()) {
      return [];
    }

    const grouped: any[][] = [];
    for (let i = 0; i < this.newsList.length; i += this.newsPerSlide) {
      grouped.push(this.newsList.slice(i, i + this.newsPerSlide));
    }
    return grouped;
  }

  /**
   * Get carousel interval in milliseconds
   */
  getCarouselInterval(): number {
    return 4000; // 4 seconds interval
  }

  /**
   * Navigate to all news page
   */
  viewAllNews(): void {
    console.log('View all news clicked');
    // Example: this.router.navigate(['/news']);
  }

  /**
   * Handle news card click
   */
  onNewsClick(newsItem: any): void {
    console.log('News clicked:', newsItem);
    // Example: this.router.navigate(['/news', newsItem.id]);
  }

  /**
   * Get total number of news slides
   */
  getTotalSlides(): number {
    return this.getGroupedNews().length;
  }

  /**
   * Check if carousel should show controls
   */
  shouldShowControls(): boolean {
    return this.getTotalSlides() > 1;
  }


}