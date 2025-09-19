// ceo.ts - Simplified CEO Component
import { CommonModule } from '@angular/common';
import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-ceo',
  imports: [CommonModule],
  templateUrl: './ceo.html',
  styleUrl: './ceo.css'
})
export class Ceo {
  // Input properties - receive data from parent
  @Input() siteData: any = null;
  @Input() currentLanguage: string = 'en';
  @Input() isRTL: boolean = false;
  @Input() isLoading: boolean = false;

  constructor() { }

  
  // Helper methods for template
  getCeoName(): string {
    return this.siteData?.ceO_Name || '';
  }

  getCeoTitle(): string {
    return this.siteData?.ceO_JobTitle || '';
  }

  getIntroMessage(): string {
    return this.siteData?.ceO_IntroMessage || '';
  }

  getEndMessage(): string {
    return this.siteData?.ceO_EndMessage || '';
  }

  hasData(): boolean {
    return this.siteData !== null && !this.isLoading;
  }
}