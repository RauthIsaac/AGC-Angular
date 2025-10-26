import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Core/Services/auth-service/auth-service';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { MessagesService, Message } from '../../../Core/Services/messages-service/messages-service';
import { NewsService } from '../../../Core/Services/news-service/news-service';
import { SiteIdentityService } from '../../../Core/Services/site-identity-service/site-identity-service';
import { NewsItem, NewsDto, CreateNewsRequest, UpdateNewsRequest } from '../../../Shared/models/news';
import { SiteData } from '../../../Shared/models/site-data';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../Constants/api-endpoints';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private messagesService = inject(MessagesService);
  private newsService = inject(NewsService);
  private siteIdentityService = inject(SiteIdentityService);
  private router = inject(Router);

  sidebarOpen: boolean = true;  // Visible by default on all screens
  activeTab = 'overview';
  
  // Mock data - replace with real data from services
  stats = {
    totalProducts: 25,
    totalNews: 0, // Will be updated from API
    totalMessages: 0, // Will be updated from API
    totalViews: 1547
  };

  recentMessages: Message[] = []; // Will be loaded from API
  isLoadingMessages = true;

  // News management
  allNews: NewsItem[] = [];
  isLoadingNews = true;
  showNewsForm = false;
  editingNews: NewsItem | null = null;
  selectedFile: File | null = null;
  selectedFilePreview: string | null = null; // For image preview
  newsForm: CreateNewsRequest = {
    id: 1,
    langCode: 0,
    newsImgUrl: '',
    title: '',
    subTitle: '',
    description: ''
  };

  // Site Identity management
  currentSiteData: SiteData | null = null;
  allSiteData: SiteData[] = []; // Store all language data
  isLoadingSiteData = true;
  isSavingSiteData = false;
  siteDataForm: SiteData | null = null;
  selectedEditLanguage: number = 0; // 0 for English, 1 for Arabic

  ngOnInit() {
    console.log('Dashboard component initializing...');
    
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Set sidebar state based on screen size
    this.checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', () => this.checkScreenSize());
    
    // Load messages from API only if authenticated
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated, loading data...');
      this.loadMessages();
      this.loadNews();
      this.loadSiteData();
    } else {
      console.log('User not authenticated');
      }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadMessages() {
   this.isLoadingMessages = true;
    this.messagesService.getAllMessages().subscribe({
      next: (messages) => {
        this.recentMessages = messages;
        this.stats.totalMessages = messages.length;
        this.isLoadingMessages = false;
      },
      error: (error) => {
        this.isLoadingMessages = false;
      }
    });
  }

  checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false; // Hide on mobile
    } else {
      this.sidebarOpen = true; // Show on desktop (sidebar always visible, content moves)
    }
  }

  

  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Only close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleLanguage() {
    // Toggle between Arabic ('ar') and English ('en')
    const currentLang = this.languageService.getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    this.languageService.setLanguage(newLang);
  }

  getCurrentLanguageIcon(): string {
    return this.languageService.getCurrentLanguage() === 'ar' ? '🇺🇸' : '🇸🇦';
  }

  getCurrentLanguageText(): string {
    return this.languageService.getCurrentLanguage() === 'ar' ? 'English' : 'العربية';
  }

  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getDashboardTitle(): string {
    return this.isRTL() ? 'لوحة التحكم' : 'Admin Dashboard';
  }

  getOverviewTitle(): string {
    return this.isRTL() ? 'نظرة عامة' : 'Overview';
  }

  getSiteIdentityTitle(): string {
    return this.isRTL() ? 'هوية الموقع' : 'Site Identity';
  }

  getProductsTitle(): string {
    return this.isRTL() ? 'المنتجات' : 'Products';
  }

  getNewsTitle(): string {
    return this.isRTL() ? 'الأخبار' : 'News';
  }

  getMessagesTitle(): string {
    return this.isRTL() ? 'الرسائل' : 'Messages';
  }

  getUnreadMessagesCount(): number {
    // Show count of latest 2 messages only
    return Math.min(this.recentMessages.length, 2);
  }

  getLatestMessages(): Message[] {
    // Return only the latest 2 messages for overview
    return this.recentMessages.slice(0, 2);
  }

  deleteMessage(messageId: number) {
    if (confirm(this.isRTL() ? 'هل تريد حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) {
      this.messagesService.deleteMessage(messageId).subscribe({
        next: () => {
          // Remove message from local array
          this.recentMessages = this.recentMessages.filter(m => m.id !== messageId);
          this.stats.totalMessages = this.recentMessages.length;
        },
        error: (error) => {
          console.error('Error deleting message:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء حذف الرسالة' : 'Error deleting message');
        }
      });
    }
  }

  getLogoutText(): string {
    return this.isRTL() ? 'تسجيل الخروج' : 'Logout';
  }

  ngOnDestroy() {
    // Remove event listener
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  // News Management Methods
  loadNews() {
    this.isLoadingNews = true;
    this.newsService.getAllNews().subscribe({
      next: (news) => {
        this.allNews = news;
        this.stats.totalNews = news.length;
        this.isLoadingNews = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.isLoadingNews = false;
      }
    });
  }

  deleteNews(newsId: number, langCode: number) {
    if (confirm(this.isRTL() ? 'هل تريد حذف هذا الخبر؟' : 'Are you sure you want to delete this news?')) {
      this.newsService.deleteNews(newsId, langCode).subscribe({
        next: () => {
          console.log('News deleted successfully');
          // Reload the news list to get fresh data from server
          this.loadNews();
        },
        error: (error) => {
          console.error('Error deleting news:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء حذف الخبر' : 'Error deleting news');
        }
      });
    }
  }

  getLatestNews(): NewsItem[] {
    return this.allNews.slice(0, 3);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Always use English format for admin dashboard (Gregorian calendar)
    return date.toLocaleDateString('en-US');
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Image handling methods with stable cache busting
  private imageCache = new Map<string, string>();
  private lastUpdateTime = Date.now();
  imageErrors = new Set<number>(); // Track which images failed to load

  getImageUrl(imageUrl: string, bustCache: boolean = false): string {
    if (!imageUrl) return '';
    
    const cacheKey = `${imageUrl}_${bustCache}`;
    
    // Return cached URL if available
    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }
    
    let fullUrl = '';
    if (imageUrl.startsWith('http')) {
      fullUrl = imageUrl;
    } else {
      fullUrl = `${environment.baseUrl}${imageUrl}`;
    }
    
    // Add cache busting parameter if needed
    if (bustCache) {
      const separator = fullUrl.includes('?') ? '&' : '?';
      fullUrl += `${separator}t=${this.lastUpdateTime}`;
    }
    
    // Cache the result
    this.imageCache.set(cacheKey, fullUrl);
    return fullUrl;
  }

  // Call this method after successful image update
  private clearImageCache(): void {
    this.imageCache.clear();
    this.lastUpdateTime = Date.now();
  }

  // Handle image loading errors
  onImageError(event: any, news?: NewsItem): void {
    console.log('Image failed to load:', event.target.src);
    if (news) {
      console.log('Failed for news:', news.id, news.title);
      this.imageErrors.add(news.id);
    }
    // Set fallback image or hide the image
    event.target.style.display = 'none';
  }

  // Retry loading an image
  retryImageLoad(news: NewsItem): void {
    this.imageErrors.delete(news.id);
    this.clearImageCache();
    // Force reload of this specific news
    this.loadNews();
  }

  // Method to verify if image exists after update
  private verifyImageExists(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = this.getImageUrl(imageUrl, true);
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Get image URL with cache busting for recently updated images
  getNewsImageUrl(imageUrl: string, newsId?: number): string {
    if (!imageUrl) return '';
    
    // Always use cache busting for news images to ensure fresh images
    return this.getImageUrl(imageUrl, true);
  }

  openAddNewsForm() {
    this.editingNews = null;
    this.selectedFile = null;
    this.selectedFilePreview = null;
    // Get the next available ID (highest ID + 1)
    const maxId = this.allNews.length > 0 ? Math.max(...this.allNews.map(n => n.id)) : 0;
    const nextId = maxId + 1;
    console.log('Setting new news ID to:', nextId);
    this.newsForm = {
      id: nextId, // Auto-generate next ID
      langCode: 0,
      newsImgUrl: '',
      title: '',
      subTitle: '',
      description: ''
    };
    console.log('News form after reset:', this.newsForm);
    this.showNewsForm = true;
  }

  openEditNewsForm(news: NewsItem) {
    this.editingNews = news;
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.newsForm = {
      id: news.id, 
      langCode: news.langCode,
      newsImgUrl: news.newsImgUrl,
      title: news.title,
      subTitle: news.subTitle,
      description: news.description
    };
    this.showNewsForm = true;
  }

  closeNewsForm() {
    this.showNewsForm = false;
    this.editingNews = null;
    this.selectedFile = null;
    this.selectedFilePreview = null;
  }

  async saveNews() {
    console.log('Saving news, editingNews:', this.editingNews);
    console.log('News form data:', this.newsForm);
    console.log('Selected file:', this.selectedFile);
    
    if (this.editingNews) {
      // Update existing news
      const updateRequest: UpdateNewsRequest = {
        ...this.newsForm
      };
      
      console.log('Update request:', updateRequest);
      
      this.newsService.updateNews(updateRequest, this.selectedFile || undefined).subscribe({
        next: async (updatedNews) => {
          console.log('News updated successfully:', updatedNews);
          
          // Clear image cache for fresh loading
          this.clearImageCache();
          
          // Always reload the news list to get fresh data from server
          this.loadNews();
          this.closeNewsForm();
          
          // Show success message
          alert(this.isRTL() ? 
            'تم تحديث الخبر بنجاح' : 
            'News updated successfully');
        },
        error: (error) => {
          console.error('Error updating news:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء تحديث الخبر' : 'Error updating news');
        }
      });
    } else {
      // Create new news
      // Convert ID to number to ensure it's not a string
      
      // Ensure ID is not zero or invalid
      if (!this.newsForm.id || this.newsForm.id <= 0 || isNaN(this.newsForm.id)) {
        alert(this.isRTL() ? 'يجب إدخال رقم صحيح للخبر' : 'Please enter a valid news ID');
        return;
      }
      
      // Check if ID already exists
      const existingNews = this.allNews.find(news => news.id === this.newsForm.id);
      if (existingNews) {
        alert(this.isRTL() ? 'رقم الخبر موجود بالفعل، اختر رقم آخر' : 'News ID already exists, please choose another ID');
        return;
      }
      
      // Create request with converted ID
      const createRequest: CreateNewsRequest = { ...this.newsForm };
      
      console.log('================== إضافة خبر جديد ==================');
      console.log('📰 تفاصيل الخبر الجديد:');
      console.log('🆔 ID:', createRequest.id);
      console.log('🌐 Language Code:', createRequest.langCode, createRequest.langCode === 0 ? '(English)' : '(Arabic)');
      console.log('📝 Title:', createRequest.title);
      console.log('📄 Subtitle:', createRequest.subTitle);
      console.log('📖 Description:', createRequest.description);
      console.log('🖼️ Image URL:', createRequest.newsImgUrl);
      console.log('📁 Selected File:', this.selectedFile ? this.selectedFile.name : 'No file selected');
      console.log('📊 Complete Request Object:', createRequest);
      console.log('==================================================');
      
      this.newsService.createNews(createRequest, this.selectedFile || undefined).subscribe({
        next: (newNews) => {
          console.log('✅ ================== نجحت إضافة الخبر! ==================');
          console.log('🎉 تم إنشاء الخبر بنجاح!');
          console.log('📥 Response from server:', newNews);
          console.log('🆔 ID المُعطى من السيرفر:', newNews?.id || 'No ID returned');
          console.log('📊 تفاصيل الخبر المُحفوظ:', JSON.stringify(newNews, null, 2));
          console.log('=======================================================');
          
          // Clear image cache for fresh loading
          this.clearImageCache();
          
          // Always reload the news list to get fresh data from server
          this.loadNews();
          this.closeNewsForm();
        },
        error: (error) => {
          console.log('🚨 ❌ حدث خطأ في إضافة الخبر / News Creation Error:');
          console.log('============================');
          console.error('خطأ مفصل / Detailed Error:', error);
          console.log('حالة الطلب / Request Status:', error.status);
          console.log('رسالة الخطأ / Error Message:', error.message);
          console.log('============================');
          alert(this.isRTL() ? 'حدث خطأ أثناء إنشاء الخبر' : 'Error creating news');
        }
      });
    }
  }

  // Site Identity Management Methods
  loadSiteData() {
    console.log('Starting loadSiteData...');
    console.log('Current siteDataForm before loading:', this.siteDataForm);
    this.isLoadingSiteData = true;
    
    this.siteIdentityService.getCurrentSiteData().subscribe({
      next: (siteData) => {
        console.log('=== Site Identity API Response ===');
        console.log('Complete API Response:', siteData);
        console.log('Type of response:', typeof siteData);
        console.log('Is Array?', Array.isArray(siteData));
        
        if (Array.isArray(siteData)) {
          console.log('Number of records:', siteData.length);
          siteData.forEach((record, index) => {
            console.log(`Record ${index + 1}:`, record);
            console.log(`Record ${index + 1} langCode:`, record.langCode);
          });
          
          // Store all data for language switching
          this.allSiteData = siteData;
          
          // Load data for current selected edit language
          this.loadDataForEditLanguage();
          
        } else {
          console.log('Single record structure:', Object.keys(siteData));
          this.allSiteData = [siteData];
          this.currentSiteData = siteData;
          this.siteDataForm = JSON.parse(JSON.stringify(siteData));
        }
        console.log('================================');
        
        this.isLoadingSiteData = false;
      },
      error: (error) => {
        console.error('Error loading site data:', error);
        this.isLoadingSiteData = false;
        
        // Use fallback data from LanguageService if API fails
        const fallbackData = this.languageService.getCurrentSiteData();
        if (fallbackData) {
          this.allSiteData = [fallbackData];
          this.currentSiteData = fallbackData;
          this.siteDataForm = { ...fallbackData };
        }
      }
    });
  }

  // Load data for the currently selected edit language
  loadDataForEditLanguage() {
    console.log('Loading data for edit language:', this.selectedEditLanguage);
    
    if (!this.allSiteData || this.allSiteData.length === 0) {
      console.warn('No allSiteData available');
      this.siteDataForm = null;
      return;
    }
    
    const selectedData = this.allSiteData.find(record => record && record.langCode === this.selectedEditLanguage);
    
    if (selectedData) {
      this.currentSiteData = selectedData;
      this.siteDataForm = JSON.parse(JSON.stringify(selectedData));
      console.log('Form data loaded for language:', this.selectedEditLanguage, this.siteDataForm);
    } else {
      console.warn('No data found for language:', this.selectedEditLanguage);
      // Set form to null to show "No data" state
      this.siteDataForm = null;
    }
  }

  // Switch edit language
  switchEditLanguage(langCode: number) {
    console.log('Switching edit language to:', langCode);
    this.selectedEditLanguage = langCode;
    this.loadDataForEditLanguage();
  }

  // Get display text for language buttons
  getEditLanguageText(langCode: number): string {
    return langCode === 0 ? 'English' : 'العربية';
  }

  // Check if language data exists
  hasDataForLanguage(langCode: number): boolean {
    if (!this.allSiteData || this.allSiteData.length === 0) {
      return false;
    }
    return this.allSiteData.some(record => record && record.langCode === langCode);
  }

  updateSiteData() {
    console.log('=== UPDATE SITE DATA DEBUG ===');
    console.log('Auth token:', this.authService.getToken());
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Token exists:', !!this.authService.getToken());
    
    if (!this.siteDataForm) {
      console.log('No site data form to save');
      return;
    }

    // Ensure the form has the correct language code
    this.siteDataForm.langCode = this.selectedEditLanguage;
    
    console.log('Saving site data for language:', this.selectedEditLanguage, this.siteDataForm);
    this.isSavingSiteData = true;
    
    this.siteIdentityService.updateSiteData(this.siteDataForm).subscribe({
      next: (updatedData) => {
        console.log('Site data updated successfully:', updatedData);
        
        // If API returns null or empty, keep current form data
        if (!updatedData) {
          console.log('API returned null/empty, keeping current form data');
          // Update the current language data in allSiteData with form data
          const index = this.allSiteData.findIndex(record => record.langCode === this.selectedEditLanguage);
          if (index >= 0) {
            this.allSiteData[index] = { ...this.siteDataForm } as SiteData;
          } else {
            this.allSiteData.push({ ...this.siteDataForm } as SiteData);
          }
        } else if (Array.isArray(updatedData)) {
          this.allSiteData = updatedData;
        } else {
          // Update the specific language record in allSiteData
          const index = this.allSiteData.findIndex(record => record.langCode === this.selectedEditLanguage);
          if (index >= 0) {
            this.allSiteData[index] = updatedData;
          } else {
            this.allSiteData.push(updatedData);
          }
        }
        
        // Reload data for current edit language
        this.loadDataForEditLanguage();
        
        this.isSavingSiteData = false;
        
        // Show success message
        alert(this.isRTL() ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully');
      },
      error: (error) => {
        console.error('=== ERROR DETAILS ===');
        console.error('Full error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error headers:', error.headers);
        console.error('Error url:', error.url);
        this.isSavingSiteData = false;
        alert(this.isRTL() ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving data');
      }
    });
  }

  resetSiteDataForm() {
    if (this.currentSiteData) {
      // Create a deep copy to avoid reference issues
      this.siteDataForm = JSON.parse(JSON.stringify(this.currentSiteData));
      console.log('Form data reset to:', this.siteDataForm);
    } else {
      console.log('No current site data to reset form');
    }
  }

  // Helper methods for dynamic property access
  getDynamicProperty(propertyName: string): any {
    const value = this.siteDataForm ? (this.siteDataForm as any)[propertyName] : '';
    //console.log(`getDynamicProperty(${propertyName}):`, value);
    return value;
  }

  setDynamicProperty(propertyName: string, value: any): void {
    if (this.siteDataForm) {
      (this.siteDataForm as any)[propertyName] = value;
      //console.log(`setDynamicProperty(${propertyName}):`, value);
    } else {
      console.log('No siteDataForm available for setDynamicProperty');
    }
  }


}