import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { CommonModule } from '@angular/common';
import { API_URL } from '../../../Constants/api-endpoints';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './news-card.html',
  styleUrls: ['./news-card.css']
})
export class NewsCard{
  // Keep the news input as it's specific data for this card
  @Input({ required: true }) news!: any;
  
  // Inject language service for language-related functionality
  private languageService = inject(LanguageService);

  constructor() { }


  // Helper methods for template
  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  // Format date based on language
  getNewsDate(): string {
    return this.news.createdAt;
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