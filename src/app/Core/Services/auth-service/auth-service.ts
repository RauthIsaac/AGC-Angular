import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../Constants/api-endpoints';
import { LoginRequest, AuthDTO } from '../../../Shared/models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<AuthDTO> {
    return this.http.post<AuthDTO>(`${API_ENDPOINTS.AUTH.LOGIN}`, loginData).pipe(
      tap(response => {
        if (response.isAuthenticated && response.token) {
          this.setAuthData(response);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    return token;
  }

  isAuthenticated(): boolean {
    const isAuth = this.hasValidToken();
    return isAuth;
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
      return false;
    }

    const expiryDate = new Date(expiry);
    const now = new Date();
    
    if (now >= expiryDate) {
      this.logout();
      return false;
    }

    return true;
  }

  private setAuthData(authData: AuthDTO): void {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('tokenExpiry', authData.expireOn.toString());
    this.isAuthenticatedSubject.next(true);
  }
}