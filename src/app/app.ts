import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Footer } from "./Shared/footer/footer";
import { Header } from './Shared/header/header';
import { NavigationService } from './Shared/services/NavigationService/navigation-service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  // Inject services using modern Angular inject function
  private navigationService = inject(NavigationService);
  private router = inject(Router);

  activeSection: string = 'home';
  isAdminRoute: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor() {}
  
  ngOnInit() {
    // Subscribe to active section changes
    this.subscription.add(
      this.navigationService.activeSection$.subscribe(section => {
        this.activeSection = section;
      })
    );

    // Listen for route changes to handle URL fragments
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        // Check if current route is admin
        this.isAdminRoute = event.url.startsWith('/admin');
        
        // Handle URL fragments when navigation ends
        setTimeout(() => {
          this.navigationService.handleUrlFragment();
        }, 100);
      })
    );

    // Handle initial URL fragment if present
    setTimeout(() => {
      this.navigationService.handleUrlFragment();
    }, 100);

    // Set initial admin route state
    this.isAdminRoute = this.router.url.startsWith('/admin');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isActive(section: string): boolean {
    return this.navigationService.isActive(section);
  }
}