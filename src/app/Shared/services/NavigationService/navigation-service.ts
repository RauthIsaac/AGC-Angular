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
        

        setTimeout(() => {
          this.activeSectionSubject.next(sectionId);
        }, 500);
        
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
}