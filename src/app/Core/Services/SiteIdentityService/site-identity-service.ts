// import { HttpClient } from '@angular/common/http';
// import { Injectable, signal, inject } from '@angular/core';
// import { Observable, tap, catchError, of } from 'rxjs';
// import { SiteData } from '../../../Shared/models/site-data';

// @Injectable({
//   providedIn: 'root'
// })
// export class SiteIdentityService {
//   private http = inject(HttpClient);
  
//   API_URL: string = 'https://localhost:7162/api/SiteIdentity';
  
//   // Signals for reactive data
//   siteData = signal<SiteData | null>(null);
//   isLoading = signal<boolean>(false);
  
//   // Observable for components to subscribe to
//   siteData$ = this.siteData.asReadonly();
//   isLoading$ = this.isLoading.asReadonly();
  
//   constructor() {}
  
//   /*---------- Get Site Identity By Language Code - Main API method ----------*/
//   getSiteIdentityByLangCode(langCode: number): Observable<SiteData> {
//     this.isLoading.set(true);
    
//     return this.http.get<SiteData>(`${this.API_URL}/${langCode}`).pipe(
//       tap((data: SiteData) => {
//         this.siteData.set(data);
//         console.log('Site Data with Language Code', langCode, 'loaded:', data);
//         this.isLoading.set(false);
//       }),
//       catchError((error: any) => {
//         console.error('Error loading site data:', error);
//         this.isLoading.set(false);
//         this.siteData.set(null);
//         return of({} as SiteData);
//       })
//     );
//   }
  
//   /*---------- Get current site data ----------*/
//   getCurrentSiteData(): SiteData | null {
//     return this.siteData();
//   }
  
//   /*---------- Check if data is currently loading ----------*/
//   isDataLoading(): boolean {
//     return this.isLoading();
//   }
  
//   /*---------- Get all site data as a variable ----------*/
//   get allSiteData(): SiteData | null {
//     return this.siteData();
//   }
  
//   /*---------- Get specific property from site data ----------*/
//   getProperty(propertyName: string): any {
//     const data = this.siteData();
//     return data ? data[propertyName as keyof SiteData] : null;
//   }
  
//   /*---------- Get nested property using dot notation ----------*/
//   getNestedProperty(propertyPath: string): any {
//     const data = this.siteData();
//     if (!data) return null;
    
//     return propertyPath.split('.').reduce((current, key) => {
//       return current && current[key] !== undefined ? current[key] : null;
//     }, data as any);
//   }
  
//   /*---------- Get company information ----------*/
//   getCompanyInfo() {
//     const data = this.siteData();
//     if (!data) return null;
    
//     return {
//       name: data.companyName || '',
//       logoUrl: data.logoUrl || '',
//     };
//   }
  
//   /*---------- Get CEO information ----------*/
//   getCeoInfo() {
//     const data = this.siteData();
//     if (!data) return null;
    
//     return {
//       name: data.ceO_Name || '',
//       title: data.ceO_JobTitle || '',
//       introMessage: data.ceO_IntroMessage || '',
//       endMessage: data.ceO_EndMessage || ''
//     };
//   }
  
//   /*---------- Get news list ----------*/
//   getNewsList(): any[] {
//     const data = this.siteData();
//     return data?.news || [];
//   }
  
//   /*---------- Get specific news item by ID ----------*/
//   getNewsById(id: string | number): any | null {
//     const newsList = this.getNewsList();
//     return newsList.find(item => String(item.id) === String(id)) || null;
//   }
  
//   /*---------- Check if site data is available ----------*/
//   hasSiteData(): boolean {
//     return this.siteData() !== null && !this.isLoading();
//   }
  
//   /*---------- Refresh current data ----------*/
//   refreshData(langCode: number): void {
//     this.getSiteIdentityByLangCode(langCode).subscribe();
//   }
// }