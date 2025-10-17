import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/Services/auth-service/auth-service';
import { LanguageService } from '../../../Core/Services/language-service/language-service';
import { AuthDTO, LoginRequest } from '../../../Shared/models/auth';
import { API_URL } from '../../../Constants/api-endpoints';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  private languageService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  formErrors: { [key: string]: string } = {};
  isSubmitting = false;
  submissionError = '';
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.setupFormValidation();
    this.checkIfAlreadyAuthenticated();
  }

  private checkIfAlreadyAuthenticated() {
    if (this.authService.isAuthenticated()) {
      // User is already authenticated, redirect to admin dashboard
      this.router.navigate(['/admin']);
    }
  }

  private setupFormValidation() {
    this.loginForm.valueChanges.subscribe(() => {
      this.validateForm();
    });
  }

  private validateForm() {
    this.formErrors = {};
    const controls = this.loginForm.controls;

    if (controls['email'].invalid && controls['email'].touched) {
      if (controls['email'].errors?.['required']) {
        this.formErrors['email'] = this.isRTL() ? 'البريد الإلكتروني مطلوب' : 'Email is required';
      } else if (controls['email'].errors?.['email']) {
        this.formErrors['email'] = this.isRTL() ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
      }
    }

    if (controls['password'].invalid && controls['password'].touched) {
      if (controls['password'].errors?.['required']) {
        this.formErrors['password'] = this.isRTL() ? 'كلمة المرور مطلوبة' : 'Password is required';
      } else if (controls['password'].errors?.['minlength']) {
        this.formErrors['password'] = this.isRTL() ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
      }
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submissionError = '';

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (response: AuthDTO) => {
          
          if (response.isAuthenticated) {
            // Navigate to admin dashboard (AuthService already handles token storage)
            this.router.navigate(['/admin']);
          } else {
            this.submissionError = response.message || (this.isRTL() ? 'فشل في تسجيل الدخول' : 'Login failed');
          }
          this.isSubmitting = false;
        },
        error: (error: any) => {
          this.submissionError = this.isRTL() ? 
            'خطأ في الاتصال بالخادم. حاول مرة أخرى.' : 
            'Connection error. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.validateForm();
    }
  }

  isRTL(): boolean {
    return this.languageService.isRTL();
  }

  getLoginTitle(): string {
    return this.isRTL() ? 'تسجيل الدخول' : 'Sign In';
  }

  getEmailLabel(): string {
    return this.isRTL() ? 'البريد الإلكتروني' : 'Email Address';
  }

  getPasswordLabel(): string {
    return this.isRTL() ? 'كلمة المرور' : 'Password';
  }

  getLoginButtonText(): string {
    return this.isSubmitting ? 
      (this.isRTL() ? 'جاري تسجيل الدخول...' : 'Signing in...') :
      (this.isRTL() ? 'تسجيل الدخول' : 'Sign In');
  }

  getForgotPasswordText(): string {
    return this.isRTL() ? 'نسيت كلمة المرور؟' : 'Forgot Password?';
  }

  getLogoUrl(): string {
    return API_URL + this.languageService.getText('logoUrl', 'AGC Lubricants');
  }
}