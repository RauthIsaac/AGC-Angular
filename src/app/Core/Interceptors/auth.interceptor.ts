import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service/auth-service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  console.log('=== FUNCTIONAL AUTH INTERCEPTOR ===');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
 
  // Inject the AuthService
  const authService = inject(AuthService);
  
  // Get the auth token from the service
  const authToken = authService.getToken();
  console.log('Token from service:', authToken ? 'EXISTS' : 'NULL');
  console.log('Is authenticated:', authService.isAuthenticated());
  
  
  // If there's a token and user is authenticated, add it to the request
  if (authToken && authService.isAuthenticated()) {
    console.log('Adding Authorization header with token');
    // Clone the request and add the authorization header
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Request headers:', authReq.headers.keys());

    // Pass the cloned request with the header to the next handler
    return next(authReq);
  }

  console.log('NO TOKEN - sending request without Authorization');
  // If no token, pass the original request
  return next(req);
};