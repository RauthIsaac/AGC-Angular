import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private activeSectionSubject = new BehaviorSubject<string>('home');
  public activeSection$ = this.activeSectionSubject.asObservable();
  
  private sections = ['home', 'about', 'news', 'products', 'contact'];
  private headerHeight = 150; // Adjust based on your header height

  constructor(private router: Router) {
    this.initScrollListener();
  }

  // Initialize scroll listener
  private initScrollListener() {
    fromEvent(window, 'scroll')
      .pipe(throttleTime(100)) // Throttle scroll events for better performance
      .subscribe(() => {
        this.checkActiveSection();
      });
  }

  // Method to navigate to specific section
  navigateToSection(sectionId: string): void {
    this.activeSectionSubject.next(sectionId);
    
    if (sectionId === 'home') {
      // Navigate to top for home
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    } else {
      this.router.navigate(['/home'], { fragment: sectionId }).then(() => {
        // Scroll to the element after navigation
        const element = document.getElementById(sectionId);
        if (element) {
          const elementPosition = element.offsetTop - this.headerHeight;
          
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  }

  // Check which section is currently active based on scroll position
  private checkActiveSection(): void {
    const scrollPosition = window.pageYOffset + this.headerHeight + 50; // Adding 50px buffer

    // Check if we're at the top (home section)
    if (window.pageYOffset < 100) {
      this.activeSectionSubject.next('home');
      return;
    }

    // Check other sections
    for (let section of this.sections.slice(1)) { // Skip 'home' as it's handled above
      const element = document.getElementById(section);
      if (element) {
        const sectionTop = element.offsetTop;
        const sectionBottom = sectionTop + element.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          this.activeSectionSubject.next(section);
          break;
        }
      }
    }
  }

  // Get current active section
  getCurrentActiveSection(): string {
    return this.activeSectionSubject.value;
  }

  // Check if a section is active
  isActive(section: string): boolean {
    return this.getCurrentActiveSection() === section;
  }

  // Method to manually trigger active section check
  updateActiveSection(): void {
    this.checkActiveSection();
  }

  // Get all available sections
  getSections(): string[] {
    return [...this.sections];
  }

  // Set header height (useful if header height changes dynamically)
  setHeaderHeight(height: number): void {
    this.headerHeight = height;
  }
}