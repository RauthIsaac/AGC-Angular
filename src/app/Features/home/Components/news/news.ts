import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NewsCard } from '../../../news/news-card/news-card';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [NewsCard, CommonModule],
  templateUrl: './news.html',
  styleUrls: ['./news.css']
})
export class News implements OnInit, OnDestroy {
  // Inject services using modern Angular inject function
  private languageService = inject(LanguageService);
  private subscription = new Subscription();

  newsList: any[] = [];

  constructor() { }

  ngOnInit() {
    // Subscribe to site data changes
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(siteData => {
        console.log("Site Data changed in News component:", siteData);
        this.getNewsList(siteData);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getNewsList(siteData: any) {
    console.log('Raw siteData:', siteData); 
    
    if (siteData && siteData.news) {
      this.newsList = Array.isArray(siteData.news) ? siteData.news : [];
      console.log('Final News List:', this.newsList);
    } else {
      this.newsList = [];
      console.log('No news data available.');
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

  hasNews(): boolean {
    return this.newsList.length > 0;
  }
}