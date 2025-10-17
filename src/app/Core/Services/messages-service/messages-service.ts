import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../Constants/api-endpoints';
import { AuthService } from '../auth-service/auth-service';

export interface Message {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
   
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getAllMessages(): Observable<Message[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Message[]>(API_ENDPOINTS.MESSAGE_GUEST.GET_ALL, { headers });
  }

  deleteMessage(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${API_ENDPOINTS.MESSAGE_GUEST.GET_ALL}/${id}`, { headers });
  }
}