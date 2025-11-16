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
import { ClientImage, ClientImageFormData, CreateClientImageRequest, UpdateClientImageRequest } from '../../../Shared/models/client-image';
import { ClientImageService } from '../../../Core/Services/client-image-service/client-image-service';
import { Product, CreateProductRequest, UpdateProductRequest, Language } from '../../../Shared/models/product';
import { ProductService } from '../../../Core/Services/product-service/product-service';
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
  private clientImageService = inject(ClientImageService);
  private productService = inject(ProductService);
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

  // Client Images management
  allClientImages: ClientImage[] = [];
  isLoadingClientImages = true;
  showClientImageForm = false;
  editingClientImage: ClientImage | null = null;
  selectedClientImageFile: File | null = null;
  selectedClientImagePreview: string | null = null;
  clientImageForm: ClientImageFormData = {
    id: 0,
    image_Url: ''
  };

  // Products management
  allProducts: Product[] = [];
  isLoadingProducts = true;
  showProductForm = false;
  editingProduct: Product | null = null;
  selectedProductFile: File | null = null;
  selectedProductPreview: string | null = null;
  productForm: CreateProductRequest = {
    id: undefined,
    langCode: Language.EN,
    name: '',
    title: '',
    subTitle: '',
    description: '',
    benefit_Title_1: '',
    benefit_Description_1: '',
    benefit_Title_2: '',
    benefit_Description_2: '',
    benefit_Title_3: '',
    benefit_Description_3: '',
    benefit_Title_4: '',
    benefit_Description_4: '',
    applicationsList: '',
    why_Choose_Statement: '',
    why_Choose_List: ''
  };

  // Language enum for template
  Language = Language;

  ngOnInit() {
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
      this.loadMessages();
      this.loadNews();
      this.loadSiteData();
      this.loadClientImages();
      this.loadProducts();
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

  getClientImagesTitle(): string {
    return this.isRTL() ? 'صور العملاء' : 'Client Images';
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
    if (news) {
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
    this.newsForm = {
      id: nextId, // Auto-generate next ID
      langCode: 0,
      newsImgUrl: '',
      title: '',
      subTitle: '',
      description: ''
    };
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
    if (this.editingNews) {
      // Update existing news
      const updateRequest: UpdateNewsRequest = {
        ...this.newsForm
      };
      
      this.newsService.updateNews(updateRequest, this.selectedFile || undefined).subscribe({
        next: async (updatedNews) => {
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
      
      this.newsService.createNews(createRequest, this.selectedFile || undefined).subscribe({
        next: (newNews) => {
          
          // Clear image cache for fresh loading
          this.clearImageCache();
          
          // Always reload the news list to get fresh data from server
          this.loadNews();
          this.closeNewsForm();
        },
        error: (error) => {
          console.error('Error creating news:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء إنشاء الخبر' : 'Error creating news');
        }
      });
    }
  }

  // Site Identity Management Methods
  loadSiteData() {
    this.isLoadingSiteData = true;
    
    this.siteIdentityService.getCurrentSiteData().subscribe({
      next: (siteData) => {
        if (Array.isArray(siteData)) {
          // Store all data for language switching
          this.allSiteData = siteData;
          
          // Load data for current selected edit language
          this.loadDataForEditLanguage();
          
        } else {
          this.allSiteData = [siteData];
          this.currentSiteData = siteData;
          this.siteDataForm = JSON.parse(JSON.stringify(siteData));
        }
        
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
    if (!this.allSiteData || this.allSiteData.length === 0) {
      this.siteDataForm = null;
      return;
    }
    
    const selectedData = this.allSiteData.find(record => record && record.langCode === this.selectedEditLanguage);
    
    if (selectedData) {
      this.currentSiteData = selectedData;
      this.siteDataForm = JSON.parse(JSON.stringify(selectedData));
    } else {
      // Set form to null to show "No data" state
      this.siteDataForm = null;
    }
  }

  // Switch edit language
  switchEditLanguage(langCode: number) {
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

  saveSiteData() {
    if (!this.siteDataForm) {
      return;
    }

    // Ensure the form has the correct language code
    this.siteDataForm.langCode = this.selectedEditLanguage;
    
    this.isSavingSiteData = true;
    
    this.siteIdentityService.updateSiteData(this.siteDataForm).subscribe({
      next: (updatedData) => {
        // If API returns null or empty, keep current form data
        if (!updatedData) {
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
        console.error('Error saving site data:', error);
        this.isSavingSiteData = false;
        alert(this.isRTL() ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving data');
      }
    });
  }

  resetSiteDataForm() {
    if (this.currentSiteData) {
      // Create a deep copy to avoid reference issues
      this.siteDataForm = JSON.parse(JSON.stringify(this.currentSiteData));
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
    }
  }

  // Client Images Management Methods
  loadClientImages() {
    this.isLoadingClientImages = true;
    this.clientImageService.getAllClientImages().subscribe({
      next: (images) => {
        this.allClientImages = images;
        this.isLoadingClientImages = false;
      },
      error: (error) => {
        console.error('Error loading client images:', error);
        this.isLoadingClientImages = false;
      }
    });
  }

  openAddClientImageForm() {
    this.editingClientImage = null;
    this.selectedClientImageFile = null;
    this.selectedClientImagePreview = null;
    this.clientImageForm = {
      id: 0,
      image_Url: ''
    };
    this.showClientImageForm = true;
  }

  openEditClientImageForm(image: ClientImage) {
    this.editingClientImage = image;
    this.selectedClientImageFile = null;
    this.selectedClientImagePreview = null;
    this.clientImageForm = {
      id: image.id,
      image_Url: image.image_Url
    };
    this.showClientImageForm = true;
  }

  closeClientImageForm() {
    this.showClientImageForm = false;
    this.editingClientImage = null;
    this.selectedClientImageFile = null;
    this.selectedClientImagePreview = null;
  }

  onClientImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedClientImageFile = file;
      
      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedClientImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveClientImage() {
    if (!this.selectedClientImageFile) {
      alert(this.isRTL() ? 'يرجى اختيار صورة' : 'Please select an image');
      return;
    }

    if (this.editingClientImage) {
      // Update existing client image
      this.clientImageService.updateClientImage(this.clientImageForm.id, this.selectedClientImageFile).subscribe({
        next: (updatedImage) => {
          this.loadClientImages();
          this.closeClientImageForm();
          alert(this.isRTL() ? 'تم تحديث صورة العميل بنجاح' : 'Client image updated successfully');
        },
        error: (error) => {
          console.error('Error updating client image:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء تحديث صورة العميل' : 'Error updating client image');
        }
      });
    } else {
      // Create new client image
      this.clientImageService.createClientImage(this.selectedClientImageFile).subscribe({
        next: (newImage) => {
          this.loadClientImages();
          this.closeClientImageForm();
          alert(this.isRTL() ? 'تم إضافة صورة العميل بنجاح' : 'Client image added successfully');
        },
        error: (error) => {
          console.error('Error creating client image:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء إنشاء صورة العميل' : 'Error creating client image');
        }
      });
    }
  }

  deleteClientImage(imageId: number) {
    if (confirm(this.isRTL() ? 'هل تريد حذف هذه الصورة؟' : 'Are you sure you want to delete this image?')) {
      this.clientImageService.deleteClientImage(imageId).subscribe({
        next: () => {
          this.loadClientImages();
          alert(this.isRTL() ? 'تم حذف صورة العميل بنجاح' : 'Client image deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting client image:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء حذف صورة العميل' : 'Error deleting client image');
        }
      });
    }
  }

  getClientImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else {
      // إضافة base URL الخاص بالخادم قبل مسار الصورة
      // Add server base URL before image path
      const baseUrl = environment.baseUrl || environment.apiUrl || 'https://localhost:7162';
      
      // تأكد من أن المسار يبدأ بـ / إذا لم يكن موجود
      // Ensure path starts with / if not present
      const imagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      
      return `${baseUrl}${imagePath}`;
    }
  }

  onClientImageError(event: any, image: ClientImage): void {
    // Set fallback image or hide the image
    event.target.style.display = 'none';
  }

  // Products Management Methods
  loadProducts() {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.stats.totalProducts = products.length;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        console.error('Error details:', error.status, error.message, error.error);
        this.allProducts = []; // Set to empty array on error
        this.stats.totalProducts = 0;
        this.isLoadingProducts = false;
        
        // Show user-friendly error message
        if (error.status === 500) {
          alert(this.isRTL() ? 'خطأ في الخادم. يرجى المحاولة لاحقاً' : 'Server error. Please try again later');
        } else if (error.status === 0) {
          alert(this.isRTL() ? 'لا يمكن الاتصال بالخادم' : 'Cannot connect to server');
        }
      }
    });
  }

  openAddProductForm() {
    this.editingProduct = null;
    this.selectedProductFile = null;
    this.selectedProductPreview = null;
    
    this.productForm = {
      id: undefined,
      langCode: Language.EN,
      name: '',
      title: '',
      subTitle: '',
      description: '',
      benefit_Title_1: '',
      benefit_Description_1: '',
      benefit_Title_2: '',
      benefit_Description_2: '',
      benefit_Title_3: '',
      benefit_Description_3: '',
      benefit_Title_4: '',
      benefit_Description_4: '',
      applicationsList: '',
      why_Choose_Statement: '',
      why_Choose_List: ''
    };
    this.showProductForm = true;
  }

  openEditProductForm(product: Product) {
    this.editingProduct = product;
    this.selectedProductFile = null;
    this.selectedProductPreview = null;
    
    this.productForm = {
      langCode: product.langCode,
      name: product.name,
      title: product.title,
      subTitle: product.subTitle || '',
      description: product.description,
      benefit_Title_1: product.benefit_Title_1 || '',
      benefit_Description_1: product.benefit_Description_1 || '',
      benefit_Title_2: product.benefit_Title_2 || '',
      benefit_Description_2: product.benefit_Description_2 || '',
      benefit_Title_3: product.benefit_Title_3 || '',
      benefit_Description_3: product.benefit_Description_3 || '',
      benefit_Title_4: product.benefit_Title_4 || '',
      benefit_Description_4: product.benefit_Description_4 || '',
      applicationsList: product.applicationsList || '',
      why_Choose_Statement: product.why_Choose_Statement || '',
      why_Choose_List: product.why_Choose_List || ''
    };
    this.showProductForm = true;
  }

  closeProductForm() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.selectedProductFile = null;
    this.selectedProductPreview = null;
  }

  onProductImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProductFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProductPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitProduct() {
    if (this.editingProduct) {
      // Update existing product
      const updateRequest: UpdateProductRequest = {
        ...this.productForm,
        id: this.editingProduct.id,
        imageUrl: this.editingProduct.imageUrl,
        imageFile: this.selectedProductFile || undefined
      };

      this.productService.updateProduct(updateRequest).subscribe({
        next: (response) => {
          alert(this.isRTL() ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully');
          this.loadProducts();
          this.closeProductForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء تحديث المنتج' : 'Error updating product');
        }
      });
    } else {
      // Create new product
      const createRequest: CreateProductRequest = {
        ...this.productForm,
        imageFile: this.selectedProductFile || undefined
      };

      // Check if user specified ID and product with same ID+Language exists
      if (this.productForm.id) {
        const existingProduct = this.allProducts.find(p => p.id === this.productForm.id && p.langCode === this.productForm.langCode);
        if (existingProduct) {
          alert(this.isRTL() ? 
            `المنتج برقم ${this.productForm.id} باللغة المحددة موجود بالفعل` : 
            `Product with ID ${this.productForm.id} in selected language already exists`
          );
          return;
        }

        // Show warning about ID assignment
        const confirmMessage = this.isRTL() ? 
          `ملاحظة: الرقم ${this.productForm.id} سيتم تجاهله حالياً. سيتم تعيين رقم تلقائي من قاعدة البيانات. هل تريد المتابعة؟` :
          `Note: ID ${this.productForm.id} will be ignored for now. Database will auto-assign an ID. Continue?`;
        
        if (!confirm(confirmMessage)) {
          return;
        }
      }

      this.productService.createProduct(createRequest).subscribe({
        next: (response) => {
          const successMessage = this.isRTL() ? 'تم إضافة المنتج بنجاح' : 'Product added successfully';
          if (response && response.id) {
            const actualIdMessage = this.isRTL() ? 
              ` برقم ${response.id}` :
              ` with ID ${response.id}`;
            alert(successMessage + actualIdMessage);
          } else {
            alert(successMessage);
          }
          this.loadProducts();
          this.closeProductForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert(this.isRTL() ? 'حدث خطأ أثناء إضافة المنتج' : 'Error adding product');
        }
      });
    }
  }

  deleteProduct(product: Product) {
    if (confirm(this.isRTL() ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      console.log('Attempting to delete product with ID:', product.id, 'LangCode:', product.langCode);
      this.productService.deleteProduct(product.id, product.langCode).subscribe({
        next: (response) => {
          alert(this.isRTL() ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          
          if (error.status === 401) {
            alert(this.isRTL() ? 'انتهت صلاحية جلسة العمل. يرجى تسجيل الدخول مرة أخرى' : 'Session expired. Please login again');
            this.router.navigate(['/login']);
          } else if (error.status === 404) {
            alert(this.isRTL() ? 'المنتج غير موجود' : 'Product not found');
            this.loadProducts(); // Refresh the list
          } else if (error.status === 500) {
            alert(this.isRTL() ? 'خطأ في الخادم' : 'Server error');
          } else {
            alert(this.isRTL() ? 'حدث خطأ أثناء حذف المنتج' : 'Error deleting product');
          }
        }
      });
    }
  }

  getProductImageUrl(imageUrl?: string): string {
    return this.productService.getProductImageUrl(imageUrl);
  }

  // Helper method to get products with same ID but different languages
  getProductLanguagesById(id: number): string {
    const products = this.allProducts.filter(p => p.id === id);
    if (products.length === 0) return '';
    
    const languages = products.map(p => p.langCode === Language.AR ? 'عربي' : 'English');
    return this.isRTL() ? 
      `اللغات الموجودة: ${languages.join(', ')}` :
      `Available languages: ${languages.join(', ')}`;
  }

  onProductImageError(event: any): void {
    event.target.src = this.productService.getProductImageUrl();
  }

  getLanguageLabel(langCode: Language): string {
    return langCode === Language.AR ? 'عربي' : 'English';
  }


}