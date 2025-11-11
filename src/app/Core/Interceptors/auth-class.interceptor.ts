import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth-service/auth-service';

@Injectable()
export class AuthInterceptorClass implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    
    const authToken = this.authService.getToken();
   
    
    if (authToken && this.authService.isAuthenticated()) {
      const authReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}