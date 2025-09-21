import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { CommonModule } from '@angular/common';
import { API_URL } from '../../../Constants/api-endpoints';
import { TruncatePipe } from "../../../Shared/Pipes/TruncatePipe";

@Component({
  selector: 'app-news-card',
  imports: [RouterLink, CommonModule, TruncatePipe],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css']
})
export class NewsCard implements OnInit {
  // Keep the news input as it's specific data for this card
  @Input({ required: true }) news!: any;
  
  // Inject language service for language-related functionality
  private languageService = inject(LanguageService);

  constructor() { }

  ngOnInit(): void {
    if (this.news) {
      console.log('News data received in NewsCard:', this.news);
    }
  }

  // Helper methods for template
  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  // Format date based on language
  getFormattedDate(dateString?: string): string {
    if (!dateString && this.news?.createdDate) {
      dateString = this.news.createdDate;
    }
    
    if (!dateString) {
      // Fallback date
      return this.isRTL() ? '20 أغسطس، 2023' : 'August 20, 2023';
    }

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
    const newsImageURL = API_URL + this.news?.newsImgUrl;
    return newsImageURL;
  }

  // Get read more text based on language
  getReadMoreText(): string {
    return this.isRTL() ? 'اقرأ المزيد' : 'Read More';
  }
}