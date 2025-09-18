// services/NavigationService/navigation-service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private platformId = inject(PLATFORM_ID);
  private activeSectionSubject = new BehaviorSubject<string>('home');
  public activeSection$ = this.activeSectionSubject.asObservable();
  
  private sections = ['home', 'about', 'news', 'products', 'contact'];
  private headerHeight = 100;

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

    this.activeSectionSubject.next(sectionId);
    
    if (sectionId === 'home') {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.offsetTop - this.headerHeight;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        console.warn(`Element with id '${sectionId}' not found`);
      }
    }
  }

  private checkActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollPosition = window.pageYOffset + this.headerHeight + 50;

    if (window.pageYOffset < 100) {
      this.activeSectionSubject.next('home');
      return;
    }

    for (let section of this.sections.slice(1)) {
      const element = document.getElementById(section);
      if (element) {
        const sectionTop = element.offsetTop;
        const sectionBottom = sectionTop + element.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          if (this.activeSectionSubject.value !== section) {
            this.activeSectionSubject.next(section);
          }
          break;
        }
      }
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
}