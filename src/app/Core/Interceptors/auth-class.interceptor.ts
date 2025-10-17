import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth-service/auth-service';

@Injectable()
export class AuthInterceptorClass implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('=== AUTH INTERCEPTOR ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    
    const authToken = this.authService.getToken();
    console.log('Token from service:', authToken ? 'EXISTS' : 'NULL');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    
    if (authToken && this.authService.isAuthenticated()) {
      console.log('Adding Authorization header with token');
      const authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Request headers:', authReq.headers.keys());
      return next.handle(authReq);
    }

    console.log('NO TOKEN - sending request without Authorization');
    return next.handle(req);
  }
}