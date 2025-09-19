import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteIdentityService } from '../../../Shared/services/SiteIdentityService/site-identity-service';
import { LanguageService } from '../../../Core/Services/language-service/language-service';


@Component({
  selector: 'app-news-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './news-details.html',
  styleUrl: './news-details.css'
})
export class NewsDetails implements OnInit, OnDestroy {

  newsItem: any = null;
  newsId: string | null = null;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();

  siteIdentityData = signal<any>(null);
  currentLanguage = signal<string>('en');
  isRTLSignal = signal<boolean>(false);
  currentLanguageName = signal<string>('English');
  currentLanguageFlag = signal<string>('🇺🇸');
  isLoadingSignal = signal<boolean>(false);
  newsList = signal<any[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private siteIdentityService: SiteIdentityService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        this.newsId = params.get('id');
        console.log('News ID from route:', this.newsId);
        if (this.newsId) {
          this.loadNewsDetails();
        } else {
          this.router.navigate(['/news']);
        }
      })
    );

    // Subscribe to language changes
    this.subscription.add(
      this.languageService.currentLanguage$.subscribe(lang => {
        this.currentLanguage.set(lang);
        this.isRTLSignal.set(this.languageService.isRTL());
        this.currentLanguageName.set(this.languageService.getCurrentLanguageName());
        this.currentLanguageFlag.set(this.languageService.getCurrentLanguageFlag());
      })
    );

    // Subscribe to site data changes
    this.subscription.add(
      this.languageService.currentSiteData$.subscribe(data => {
        this.siteIdentityData.set(data);
        console.log('Current site data updated:', data);
        this.isLoadingSignal.set(false);
        if (this.newsId) {
          this.loadNewsDetails(); // Re-run loadNewsDetails when data updates
        }
      })
    );

    this.loadAllNews();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadNewsDetails(): void {
  this.isLoading = true;
  console.log('Loading news details for ID:', this.newsId);

  const data = this.siteIdentityData();
  if (data && data.news) {
    this.newsList.set(data.news);
    
    // Fix: Convert both IDs to same type for comparison
    this.newsItem = data.news.find((item: any) => {
      // Convert both to string for comparison
      return String(item.id) === String(this.newsId);
    });
    
    this.isLoading = false;
    
    if (!this.newsItem) {
      console.warn('No news item found for ID:', this.newsId);
      console.log('Available news IDs:', data.news.map((item: any) => item.id));
      this.router.navigate(['/news']);
    } else {
      console.log('News item loaded:', this.newsItem);
    }
  } else {
    console.warn('Site data or news array not available yet for ID:', this.newsId);
    this.isLoading = false;
  }
}

  loadAllNews(): void {
    this.isLoadingSignal.set(true);
    this.subscription.add(
      this.siteIdentityService.getSiteIdentity().subscribe({
        next: (data) => {
          console.log('Site data loaded from News Details:', data);
          this.siteIdentityData.set(data);
          this.isLoadingSignal.set(false);
        },
        error: (error) => {
          console.error('Error loading site data in News Details:', error);
          this.isLoadingSignal.set(false);
        }
      })
    );
  }


}