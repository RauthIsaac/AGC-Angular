import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../../Shared/models/message';
import { API_ENDPOINTS, API_URL } from '../../../Constants/api-endpoints';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  sendGuestMessage(message: Message): Observable<void> {
    return this.http.post<void>(API_URL + API_ENDPOINTS.MESSAGE_GUEST.POST, message, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}