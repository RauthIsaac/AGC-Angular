import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, CreateProductRequest, UpdateProductRequest, Language } from '../../../Shared/models/product';
import { AuthService } from '../auth-service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/Product`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError((error: any) => {
        console.error('Error fetching products:', error);
        console.error('API URL:', this.apiUrl);
        console.error('Full error:', error);
        
        if (error.status === 401) {
          console.error('Unauthorized - redirecting to login');
          // You might want to redirect to login here
        }
        
        return of([]); // Return empty array instead of mock data
      })
    );
  }

  // Get product by ID (filter from all products since backend has routing issue)
  getProduct(id: number): Observable<Product> {
    return new Observable(observer => {
      this.getProducts().subscribe({
        next: (products) => {
          const product = products.find(p => p.id === id);
          if (product) {
            observer.next(product);
          } else {
            observer.error('Product not found');
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Create new product
  createProduct(product: CreateProductRequest): Observable<any> {
    const formData = new FormData();
    
    // Add all product fields to FormData - matching C# PropertyNames exactly
    // Note: ID is not sent for creation - backend will auto-assign
    // TODO: Backend needs to be updated to handle custom ID assignment
    console.log('Note: Custom ID', product.id, 'will be ignored - backend will auto-assign ID');
    
    formData.append('LangCode', product.langCode.toString());
    formData.append('Name', product.name || '');
    formData.append('Title', product.title || '');
    formData.append('SubTitle', product.subTitle || '');
    formData.append('Description', product.description || '');
    
    formData.append('Benefit_Title_1', product.benefit_Title_1 || '');
    formData.append('Benefit_Description_1', product.benefit_Description_1 || '');
    formData.append('Benefit_Title_2', product.benefit_Title_2 || '');
    formData.append('Benefit_Description_2', product.benefit_Description_2 || '');
    formData.append('Benefit_Title_3', product.benefit_Title_3 || '');
    formData.append('Benefit_Description_3', product.benefit_Description_3 || '');
    formData.append('Benefit_Title_4', product.benefit_Title_4 || '');
    formData.append('Benefit_Description_4', product.benefit_Description_4 || '');
    
    formData.append('ApplicationsList', product.applicationsList || '');
    formData.append('Why_Choose_Statement', product.why_Choose_Statement || '');
    formData.append('Why_Choose_List', product.why_Choose_List || '');
    
    // ImageUrl will be set by backend if image is provided
    formData.append('ImageUrl', '');
    
    if (product.imageFile) {
      formData.append('image', product.imageFile); // Changed from 'ImageFile' to 'image'
    }

    // Debug: Log FormData contents
    console.log('Creating product with FormData:');
    console.log('Request will go to:', this.apiUrl);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    return this.http.post(this.apiUrl, formData, { 
      headers: this.getAuthHeaders().delete('Content-Type') // Let browser set content-type for FormData
    }).pipe(
      catchError((error) => {
        console.error('Create request failed:', error);
        console.error('Request URL:', this.apiUrl);
        console.error('Error details:', error.error);
        return throwError(() => error);
      })
    );
  }

  // Update product
  updateProduct(product: UpdateProductRequest): Observable<any> {
    const formData = new FormData();
    
    // Add all product fields to FormData - matching C# PropertyNames exactly
    formData.append('Id', product.id.toString());
    formData.append('LangCode', product.langCode.toString());
    
    // Debug: Log composite key values
    console.log('Composite key values - Id:', product.id, 'LangCode:', product.langCode);
    formData.append('Name', product.name || '');
    formData.append('Title', product.title || '');
    formData.append('SubTitle', product.subTitle || '');
    formData.append('Description', product.description || '');
    
    formData.append('Benefit_Title_1', product.benefit_Title_1 || '');
    formData.append('Benefit_Description_1', product.benefit_Description_1 || '');
    formData.append('Benefit_Title_2', product.benefit_Title_2 || '');
    formData.append('Benefit_Description_2', product.benefit_Description_2 || '');
    formData.append('Benefit_Title_3', product.benefit_Title_3 || '');
    formData.append('Benefit_Description_3', product.benefit_Description_3 || '');
    formData.append('Benefit_Title_4', product.benefit_Title_4 || '');
    formData.append('Benefit_Description_4', product.benefit_Description_4 || '');
    
    formData.append('ApplicationsList', product.applicationsList || '');
    formData.append('Why_Choose_Statement', product.why_Choose_Statement || '');
    formData.append('Why_Choose_List', product.why_Choose_List || '');
    
    // Always send ImageUrl (required by backend)
    if (product.imageUrl) {
      formData.append('ImageUrl', product.imageUrl);
    } else {
      formData.append('ImageUrl', '');
    }
    
    // Only send new image if provided
    if (product.imageFile) {
      console.log('Adding new image file to FormData');
      formData.append('image', product.imageFile);
    } else {
      console.log('No new image file provided');
    }

    // Debug: Log FormData contents
    console.log('Updating product with FormData:');
    console.log('Request will go to:', this.apiUrl);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    console.log('Sending PUT request to:', this.apiUrl);
    
    return this.http.put(this.apiUrl, formData, { 
      headers: this.getAuthHeaders().delete('Content-Type')
    }).pipe(
      catchError((error) => {
        console.error('Update request failed:', error);
        console.error('Request URL:', this.apiUrl);
        console.error('Error details:', error.error);
        
        return throwError(() => error);
      })
    );
  }

  // Delete product
  deleteProduct(id: number, langCode: Language): Observable<any> {
    // Backend expects: [HttpDelete("{id}")] with [FromQuery] parameters
    // The {id} in route is separate from the [FromQuery] id parameter
    const params = `?id=${id}&langcode=${langCode}`;
    return this.http.delete(`${this.apiUrl}/${id}${params}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError((error) => {
        console.error('Delete request failed:', error);
        console.error('Request URL:', `${this.apiUrl}/${id}${params}`);
        
        // If route-based delete fails, try query-only approach
        if (error.status === 400 || error.status === 405) {
          console.log('Trying alternative delete approach...');
          return this.http.delete(`${this.apiUrl}${params}`, { 
            headers: this.getAuthHeaders() 
          });
        }
        
        return throwError(() => error);
      })
    );
  }

  // Get product image URL
  getProductImageUrl(imageUrl?: string): string {
    if (!imageUrl) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04NSA2MEM4NSA1NS41ODE3IDg4LjU4MTcgNTIgOTMgNTJIMTA3QzExMS40MTggNTIgMTE1IDU1LjU4MTcgMTE1IDYwVjkwQzExNSA5NC40MTgzIDExMS40MTggOTggMTA3IDk4SDkzQzg4LjU4MTcgOTggODUgOTQuNDE4MyA4NSA5MFY2MFoiIGZpbGw9IiNEMEQ0REEiLz4KPGNpcmNsZSBjeD0iOTUiIGN5PSI3MCIgcj0iNSIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNOTAgODVMMTAwIDc1TDExMCA4NSIgc3Ryb2tlPSIjRjlGQUZCIiBzdHJva2Utd2lkdGg9IjIiLz4KPHR0ZXh0IHg9IjEwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2QjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `${environment.apiUrl}${imageUrl}`;
  }
}