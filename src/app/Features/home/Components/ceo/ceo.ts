import { Component, signal } from '@angular/core';
import { SiteIdentityService } from '../../../../Shared/services/SiteIdentityService/site-identity-service';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { SiteData } from '../../../../Shared/models/site-data';

@Component({
  selector: 'app-ceo',
  imports: [],
  templateUrl: './ceo.html',
  styleUrl: './ceo.css'
})
export class Ceo {

  siteIdentityData = signal<any>(null);
  currentLanguage = signal<string>('en');
  isRTLSignal = signal<boolean>(false);
  currentLanguageName = signal<string>('English');
  currentLanguageFlag = signal<string>('🇺🇸');

  private subscription: Subscription = new Subscription();

  constructor(
    private siteIdentityService: SiteIdentityService,
    private languageService: LanguageService) { }

  ngOnInit(): void {
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
        console.log('Current site data updated:', this.siteIdentityData());
      })
    );
  }


  private loadSiteIdentityData() {
    this.subscription.add(
      this.siteIdentityService.getSiteIdentity().subscribe({
        next: (data) => {
          console.log('Site data loaded successfully:', data);
        },
        error: (error) => {
          console.error('Error loading site data:', error);
        }
      })
    );
  }

}
