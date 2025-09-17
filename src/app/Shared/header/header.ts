import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../services/NavigationService/navigation-service';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  activeSection: string = 'home';
  private subscription: Subscription = new Subscription();

  constructor(private navigationService: NavigationService) {}

  ngOnInit() {
    // Subscribe to active section changes
    this.subscription.add(
      this.navigationService.activeSection$.subscribe(section => {
        this.activeSection = section;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Method to navigate to specific section
  navigateToSection(sectionId: string) {
    this.navigationService.navigateToSection(sectionId);
  }

  // Check if a section is active
  isActive(section: string): boolean {
    return this.navigationService.isActive(section);
  }
}