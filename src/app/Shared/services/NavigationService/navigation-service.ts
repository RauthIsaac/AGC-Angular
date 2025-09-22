import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private activeSectionSubject = new BehaviorSubject<string>('home');
  public activeSection$ = this.activeSectionSubject.asObservable();
 
  
  private sections = ['home', 'news', 'products', 'clients', 'about', 'contact'];
  private headerHeight = 150; 
  
  constructor() {
    this.initScrollListener();
  }

  private initScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => {
          this.checkActiveSection();
        });
    }
  }

  navigateToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Check if we're currently on the home page
    const currentUrl = this.router.url;
    const isOnHomePage = currentUrl === '/' || currentUrl === '/home' || currentUrl === '';
    
    if (!isOnHomePage) {
      // If we're not on home page, navigate to home first with fragment
      this.router.navigate(['/'], { fragment: sectionId }).then(() => {
        // Wait a bit for the route to load, then scroll to section
        setTimeout(() => {
          this.scrollToSection(sectionId);
        }, 300);
      });
    } else {
      // If we're already on home page, just scroll to section
      this.scrollToSection(sectionId);
    }
  }

  private scrollToSection(sectionId: string): void {
    this.activeSectionSubject.next(sectionId);
   
    if (sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.offsetTop - this.headerHeight - 30;
       
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        
        // Update active section after scrolling
        setTimeout(() => {
          this.activeSectionSubject.next(sectionId);
        }, 500);
        
      } else { 
        // If element not found, try again after a short delay (useful for dynamic content)
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId);
          if (retryElement) {
            const elementPosition = retryElement.offsetTop - this.headerHeight - 30;
            window.scrollTo({
              top: elementPosition,
              behavior: 'smooth'
            });
            this.activeSectionSubject.next(sectionId);
          } else {
            console.warn(`Element with id '${sectionId}' not found`);
          }
        }, 500);
      }
    }
  }

  private checkActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Only check active sections if we're on the home page
    const currentUrl = this.router.url;
    const isOnHomePage = currentUrl === '/' || currentUrl === '/home' || currentUrl === '' || currentUrl.includes('#');
    
    if (!isOnHomePage) {
      // If not on home page, don't update active section based on scroll
      return;
    }
    
    const scrollPosition = window.pageYOffset + this.headerHeight + 50;
    
    if (window.pageYOffset < 100) {
      this.activeSectionSubject.next('home');
      return;
    }

    let foundActiveSection = false;
    
    for (let i = this.sections.length - 1; i >= 1; i--) {
      const section = this.sections[i];
      const element = document.getElementById(section);
      
      if (element) {
        const sectionTop = element.offsetTop;
        const sectionHeight = element.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        if (scrollPosition >= sectionTop - 100) {
          if (this.activeSectionSubject.value !== section) {
            this.activeSectionSubject.next(section);
          }
          foundActiveSection = true;
          break;
        }
      }
    }

    if (!foundActiveSection && window.pageYOffset < 200) {
      this.activeSectionSubject.next('home');
    }
  }

  getCurrentActiveSection(): string {
    return this.activeSectionSubject.value;
  }

  isActive(section: string): boolean {
    return this.getCurrentActiveSection() === section;
  }

  updateActiveSection(): void {
    this.checkActiveSection();
  }

  getSections(): string[] {
    return [...this.sections];
  }

  setHeaderHeight(height: number): void {
    this.headerHeight = height;
  }

  forceUpdateActiveSection(sectionId: string): void {
    this.activeSectionSubject.next(sectionId);
  }

  // Method to handle navigation from URL fragments
  handleUrlFragment(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const fragment = this.router.parseUrl(this.router.url).fragment;
    if (fragment && this.sections.includes(fragment)) {
      setTimeout(() => {
        this.scrollToSection(fragment);
      }, 100);
    }
  }
}