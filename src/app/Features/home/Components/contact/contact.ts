import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../../Core/Services/language-service/language-service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Message } from '../../../../Shared/models/message';
import { MessageService } from '../../../../Shared/services/MessagesService/message-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact implements OnInit {
  private languageService = inject(LanguageService);
  private messageService = inject(MessageService);

  contactForm: FormGroup;
  formErrors: { [key: string]: string } = {};
  isSubmitting = false;
  submissionError = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]{10,}$/)]],
      message: ['', [Validators.minLength(10)]] 
    });
  }

  ngOnInit(): void {
    this.contactForm.valueChanges.subscribe(() => {
      this.validateForm();
    });
  }

  validateForm(): void {
    this.formErrors = {};
    const isRTL = this.isRTL();

    if (!this.contactForm.get('fullName')?.valid && this.contactForm.get('fullName')?.touched) {
      this.formErrors['fullName'] = isRTL
        ? 'يرجى إدخال اسم صحيح (الحد الأدنى 2 أحرف)'
        : 'Please enter a valid name (minimum 2 characters)';
    }

    if (!this.contactForm.get('email')?.valid && this.contactForm.get('email')?.touched) {
      this.formErrors['email'] = isRTL
        ? 'يرجى إدخال بريد إلكتروني صحيح'
        : 'Please enter a valid email address';
    }

    if (!this.contactForm.get('phone')?.valid && this.contactForm.get('phone')?.touched && this.contactForm.get('phone')?.value) {
      this.formErrors['phone'] = isRTL
        ? 'يرجى إدخال رقم هاتف صحيح'
        : 'Please enter a valid phone number';
    }

    if (!this.contactForm.get('message')?.valid && this.contactForm.get('message')?.touched && this.contactForm.get('message')?.value) {
      this.formErrors['message'] = isRTL
        ? 'يجب أن تكون الرسالة 10 أحرف على الأقل'
        : 'Message must be at least 10 characters long';
    }
  }

  onSubmit(): void {
    this.submissionError = '';
    
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.validateForm();
      return;
    }

    this.isSubmitting = true;
    
    const formData: Message = {
      id: 0, // Assuming API generates ID
      fullName: this.contactForm.get('fullName')?.value,
      email: this.contactForm.get('email')?.value,
      phoneNumber: this.contactForm.get('phone')?.value || '',
      message: this.contactForm.get('message')?.value || ''
    };

    this.messageService.sendGuestMessage(formData).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.snackBar.open(
          this.isRTL()
            ? 'تم إرسال الرسالة بنجاح!'
            : 'Message sent successfully!', '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar', this.isRTL() ? 'rtl-snackbar' : 'ltr-snackbar']
            }
        );

        this.contactForm.reset();
        Object.keys(this.contactForm.controls).forEach(key => {
          this.contactForm.get(key)?.setErrors(null);
        });
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.submissionError = this.isRTL()
          ? 'فشل في إرسال الرسالة. يرجى المحاولة لاحقًا.'
          : 'Failed to send message. Please try again later.';
        console.error('Submission error:', error);
      }
    });
  }

  getContactTitle(): string {
    return this.languageService.getText('contact_title', 'contact_title');
  }
  getContactDescription(): string {
    return this.languageService.getText('contact_description', 'contact_description');
  }
  getContactFormSendTitle(): string {
    return this.languageService.getText('contact_form_sendTitle', 'contact_form_sendTitle');
  }
  getContactFormFieldsName(): string {
    return this.languageService.getText('contact_form_fields_name', 'contact_form_fields_name');
  }
  getContactFormFieldsEmail(): string {
    return this.languageService.getText('contact_form_fields_email', 'contact_form_fields_email');
  }
  getContactFormFieldsPhone(): string {
    return this.languageService.getText('contact_form_fields_phone', 'contact_form_fields_phone');
  }
  getContactFormFieldsSubject(): string {
    return this.languageService.getText('contact_form_fields_subject', 'contact_form_fields_subject');
  }
  getContactFormFieldsMessage(): string {
    return this.languageService.getText('contact_form_fields_message', 'contact_form_fields_message');
  }
  getContactFormButton(): string {
    return this.languageService.getText('contact_form_button', 'contact_form_button');
  }
  getContactInfoPhone(): string {
    return this.languageService.getText('contact_info_phone', 'contact_info_phone');
  }
  getContactInfoEmail(): string {
    return this.languageService.getText('contact_info_email', 'contact_info_email');
  }
  getContactInfoAddress(): string {
    return this.languageService.getText('contact_info_address', 'contact_info_address');
  }
  getContactInfoWorkingHours(): string {
    return this.languageService.getText('contact_info_workingHours', 'contact_info_workingHours');
  }
  getContactInfoLocationMap(): string {
    return this.languageService.getText('contact_info_locationMap', 'contact_info_locationMap');
  }

  isRTL(): boolean {
    return this.languageService.isRTL();
  }
}