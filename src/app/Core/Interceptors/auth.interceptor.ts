import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service/auth-service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
 
  // Inject the AuthService
  const authService = inject(AuthService);
  
  // Get the auth token from the service
  const authToken = authService.getToken();
  
  
  // If there's a token and user is authenticated, add it to the request
  if (authToken && authService.isAuthenticated()) {
   
    // Clone the request and add the authorization header
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Pass the cloned request with the header to the next handler
    return next(authReq);
  }

  // If no token, pass the original request
  return next(req);
};