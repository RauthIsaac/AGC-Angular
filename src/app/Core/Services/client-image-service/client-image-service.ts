import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth-service/auth-service';
import { ClientImage, CreateClientImageRequest, UpdateClientImageRequest } from '../../../Shared/models/client-image';

@Injectable({
  providedIn: 'root'
})
export class ClientImageService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = `${environment.apiUrl}/api/Client_Image`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getAuthHeadersForFormData(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for FormData - let browser set it with boundary
    });
  }

  getAllClientImages(): Observable<ClientImage[]> {
    return this.http.get<ClientImage[]>(`${this.baseUrl}`, { headers: this.getAuthHeaders() });
  }

  // Get client images for public access (without authentication)
  getPublicClientImages(): Observable<ClientImage[]> {
    return this.http.get<ClientImage[]>(`${this.baseUrl}`);
  }

  getClientImage(id: number): Observable<ClientImage> {
    return this.http.get<ClientImage>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createClientImage(file: File): Observable<ClientImage> {
    const formData = new FormData();
    formData.append('Img_Urls', file);

    return this.http.post<ClientImage[]>(`${this.baseUrl}`, formData, { 
      headers: this.getAuthHeadersForFormData() 
    }).pipe(
      map((response: ClientImage[]) => response[0])
    );
  }

  updateClientImage(id: number, file: File): Observable<ClientImage> {
    const formData = new FormData();
    formData.append('client_ImageUrl', file);

    return this.http.put<ClientImage>(`${this.baseUrl}/${id}`, formData, { 
      headers: this.getAuthHeadersForFormData() 
    });
  }

  deleteClientImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}