import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LanguageService, SiteData } from '../../../Core/Services/language-service/language-service';


@Injectable({
  providedIn: 'root'
})
export class SiteIdentityService {
  
  API_URL: string = 'https://localhost:7162/api/SiteIdentity';
  
  // private languageService = inject(LanguageService);
  
  // Signals for reactive data
  siteData = signal<SiteData[]>([]);
  currentSiteData = signal<SiteData | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    private http: HttpClient, 
    private languageService: LanguageService) {

    // Subscribe to language changes to update current site data
    this.languageService.currentSiteData$.subscribe(data => {
      this.currentSiteData.set(data);
    });
  }

  /**
   * Get site identity data from API and initialize language service
   */
  getSiteIdentity(): Observable<SiteData[]> {
    this.isLoading.set(true);
    
    return this.http.get<SiteData[]>(this.API_URL).pipe(
      tap((data: SiteData[]) => {
        this.siteData.set(data);
        // Initialize the language service with the loaded data
        this.languageService.initializeWithSiteData(data);
        this.isLoading.set(false);
      })
    );
  }

  /**
   * Get current language site data
   */
  getCurrentSiteData(): SiteData | null {
    return this.currentSiteData();
  }

  /**
   * Get all site data
   */
  getAllSiteData(): SiteData[] {
    return this.siteData();
  }

  /**
   * Get site data for specific language
   */
  getSiteDataForLanguage(languageCode: string): SiteData | null {
    const language = this.languageService.availableLanguages.find(lang => lang.code === languageCode);
    if (!language) return null;

    return this.siteData().find(data => data.langCode === language.langCode) || null;
  }

  /**
   * Get CEO information for current language
   */
  getCeoInfo(): {
    name: string;
    ceoName: string;
    ceoTitle: string;
    introMessage: string;
    endMessage: string;
    logoUrl: string;
    coverUrl: string;
  } | null {
    const data = this.getCurrentSiteData();
    if (!data) return null;

    return {
      name: data.companyName,
      ceoName: data.ceO_Name,
      ceoTitle: data.ceO_JobTitle,
      introMessage: data.ceO_IntroMessage,
      endMessage: data.ceO_EndMessage,
      logoUrl: data.logoUrl,
      coverUrl: data.coverImgUrl
    };
  }

  /**
   * Get news for current language
   */
  getCurrentNews(): any[] {
    const data = this.getCurrentSiteData();
    return data?.news || [];
  }

  /**
   * Get products for current language
   */
  getCurrentProducts(): any[] {
    const data = this.getCurrentSiteData();
    return data?.products || [];
  }

  /**
   * Get specific news item by ID for current language
   */
  getNewsById(newsId: number): any | null {
    const news = this.getCurrentNews();
    return news.find(item => item.id === newsId) || null;
  }

  /**
   * Get specific product by ID for current language
   */
  getProductById(productId: number): any | null {
    const products = this.getCurrentProducts();
    return products.find(item => item.id === productId) || null;
  }

  /**
   * Check if data is currently loading
   */
  isDataLoading(): boolean {
    return this.isLoading();
  }

  /**
   * Refresh site identity data
   */
  refreshSiteData(): Observable<SiteData[]> {
    return this.getSiteIdentity();
  }
}