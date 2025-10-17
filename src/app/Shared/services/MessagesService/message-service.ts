import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../../../Shared/models/message';
import { API_ENDPOINTS} from '../../../Constants/api-endpoints';



@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  sendGuestMessage(message: Message): Observable<void> {
    const post_url =  API_ENDPOINTS.MESSAGE_GUEST.POST;
    return this.http.post<void>(post_url, message, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}