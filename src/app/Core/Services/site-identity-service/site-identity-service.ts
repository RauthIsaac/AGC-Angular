import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SiteData } from '../../../Shared/models/site-data';
import { API_ENDPOINTS } from '../../../Constants/api-endpoints';
import { AuthService } from '../auth-service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class SiteIdentityService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private currentSiteDataSubject = new BehaviorSubject<SiteData | null>(null);
  public currentSiteData$ = this.currentSiteDataSubject.asObservable();

  constructor() { }

  /**
   * Get current site identity data
   */
  getCurrentSiteData(): Observable<SiteData> {
    return this.http.get<SiteData>(`${API_ENDPOINTS.SITE_IDENTITY}`);
  }

  /**
   * Update site identity data
   * @param siteData Updated site data
   */
  updateSiteData(siteData: SiteData): Observable<SiteData> {
    //console.log('=== MANUAL AUTH HEADER ===');
    const token = this.authService.getToken();
    //console.log('Token:', token ? 'EXISTS' : 'NULL');
    
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      //console.log('Sending PUT request with manual Authorization header');
      return this.http.put<SiteData>(`${API_ENDPOINTS.SITE_IDENTITY}`, siteData, { headers });
    } else {
      //console.log('No token - sending request without Authorization header');
      return this.http.put<SiteData>(`${API_ENDPOINTS.SITE_IDENTITY}`, siteData);
    }
  }

  /**
   * Get site data by language code
   * @param langCode Language code (1 for Arabic, 0 for English)
   */
  getSiteDataByLangCode(langCode: number): Observable<SiteData> {
    return this.http.get<SiteData>(`${API_ENDPOINTS.SITE_IDENTITY}/${langCode}`);
  }

  /**
   * Update current site data in memory
   * @param siteData Site data to store
   */
  setCurrentSiteData(siteData: SiteData): void {
    this.currentSiteDataSubject.next(siteData);
  }

  /**
   * Get current site data from memory
   */
  getCurrentSiteDataValue(): SiteData | null {
    return this.currentSiteDataSubject.value;
  }
}