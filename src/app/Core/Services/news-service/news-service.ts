import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NewsItem, NewsDto, CreateNewsRequest, UpdateNewsRequest } from '../../../Shared/models/news';
import { API_ENDPOINTS } from '../../../Constants/api-endpoints';
import { AuthService } from '../auth-service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getAuthHeadersForJson(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllNews(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(API_ENDPOINTS.NEWS.GET_ALL, {
      headers: this.getAuthHeaders()
    });
  }

  createNews(newsDto: CreateNewsRequest, imageFile?: File): Observable<NewsItem> {
    //console.log('Creating news with DTO:', newsDto);
    //console.log('Image file provided:', imageFile);
    
    const formData = new FormData();
    
    // Add the DTO data
    formData.append('id', newsDto.id.toString());
    formData.append('langCode', newsDto.langCode.toString());
    formData.append('title', newsDto.title);
    formData.append('subTitle', newsDto.subTitle);
    formData.append('description', newsDto.description);
    formData.append('newsImgUrl', newsDto.newsImgUrl || '');
    
    // Add image file if provided
    if (imageFile) {
      //console.log('Adding image file to FormData:', imageFile.name, imageFile.size, imageFile.type);
      formData.append('image', imageFile, imageFile.name); // تم تغيير 'imageFile' إلى 'image'
    } else {
      //console.log('No image file provided for creation');
    }

    // Debug FormData contents
    //console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        //console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        //console.log(`${key}: ${value}`);
      }
    }

    return this.http.post<NewsItem>(API_ENDPOINTS.NEWS.CREATE, formData, {
      headers: this.getAuthHeaders()
    });
  }

  updateNews(newsDto: UpdateNewsRequest, imageFile?: File): Observable<NewsItem | null> {
    //console.log('Updating news with DTO:', newsDto);
    //console.log('Image file provided:', imageFile);
    
    const formData = new FormData();
    
    // Add the DTO data - id and langCode will be in body
    formData.append('id', newsDto.id.toString());
    formData.append('langCode', newsDto.langCode.toString());
    formData.append('title', newsDto.title);
    formData.append('subTitle', newsDto.subTitle);
    formData.append('description', newsDto.description);
    formData.append('newsImgUrl', newsDto.newsImgUrl || '');
    
    // Add image file if provided
    if (imageFile) {
      //console.log('Adding image file to FormData:', imageFile.name, imageFile.size, imageFile.type);
      formData.append('image', imageFile, imageFile.name); // تم تغيير 'imageFile' إلى 'image'
    } else {
      //console.log('No image file provided for update');
    }

    // Debug FormData contents
    //console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        //console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        //console.log(`${key}: ${value}`);
      }
    }

    //console.log('Update URL:', API_ENDPOINTS.NEWS.UPDATE);
    
    // Don't include ID in URL, it will be in the body
    return this.http.put<NewsItem>(API_ENDPOINTS.NEWS.UPDATE, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((response: NewsItem | null) => {
        //console.log('Update API response:', response);
        if (response && response.newsImgUrl) {
          //console.log('New image URL from server:', response.newsImgUrl);
        } else {
          //console.log('API returned null response or no image URL');
        }
      })
    );
  }

  deleteNews(id: number, langCode: number): Observable<any> {
    //console.log('Deleting news with ID:', id, 'LangCode:', langCode);
    
    // Use query parameters for delete
    const deleteUrl = `${API_ENDPOINTS.NEWS.DELETE}?id=${id}&langCode=${langCode}`;
    //console.log('Delete URL:', deleteUrl);
    
    return this.http.delete(deleteUrl, {
      headers: this.getAuthHeaders()
    });
  }
}