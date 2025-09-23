
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../Core/Services/language-service/language-service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css'
})

export class Loading {
  languageService = inject(LanguageService);

  get loadingText(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === 'ar' ? 'جاري التحميل، يرجى الانتظار...' : 'Loading, please wait...';
  }
}
