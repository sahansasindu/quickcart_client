import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../../components/loading-spinner/loading-spinner.component';
import {CookieManagerService} from '../../../../services/cookie-manager.service';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-otp-verification',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    LoadingSpinnerComponent,
    MatButton
  ],
  standalone:true,
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent  implements OnInit {
  showState: boolean = false;
  loading = false;
  selectedEmail: any = '';

  form = new FormGroup({
    code1: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
    code2: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
    code3: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
    code4: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]$/)]),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieManagerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(response => {
      this.selectedEmail = response.get('email');
    });

    if (this.cookieService.tokenIsExists('access_token')) {
      this.router.navigate(['/']);
    }
  }

  moveToNext(event: Event, nextField: string) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      const nextInput = document.querySelector(`input[formControlName="${nextField}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  validateNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

    // Allow control keys and numeric keys only
    if (
      !allowedKeys.includes(event.key) &&
      !/^\d$/.test(event.key) &&
      !(event.ctrlKey && event.key === 'v') // Allow Ctrl + V for pasting
    ) {
      event.preventDefault(); // Prevents input of non-numeric characters
    }
  }


  handlePaste(event: ClipboardEvent) {
    // Get the pasted data from clipboard
    const clipboardData = event.clipboardData?.getData('text') || '';

    // Sanitize input to keep only numeric characters
    const sanitizedData = clipboardData.replace(/\D/g, '');

    // Ensure the pasted data has at most 4 numeric digits
    if (sanitizedData.length > 0 && sanitizedData.length <= 4) {
      const formControls = ['code1', 'code2', 'code3', 'code4'];

      // Split the pasted data and assign it to the respective form controls
      sanitizedData.split('').forEach((digit, index) => {
        if (index < formControls.length) { // Prevent out of bounds
          this.form.patchValue({ [formControls[index]]: digit });
        }
      });

      // Move focus to the next input based on how many digits were pasted
      const nextInputIndex = sanitizedData.length;
      const nextInput = document.querySelector(`input[formControlName="code${nextInputIndex}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

  }


  verifyCode() {
    const code = (this.form.value.code1 ?? '') + (this.form.value.code2 ?? '') + (this.form.value.code3 ?? '') + (this.form.value.code4 ?? '');
    this.loading = true;
    this.authService.verifyEmail(this.selectedEmail, code).subscribe(response => {
      this.loading = false;
      this.router.navigateByUrl('/security/context/login');
    }, error => {
      this.loading = false;
    });
  }

  resend() {
    this.showState = true;
    this.authService.resendVerificationCode(this.selectedEmail).subscribe(response => {
      this.showState = false;
    }, error => {
      this.showState = false;
    });
  }
}
