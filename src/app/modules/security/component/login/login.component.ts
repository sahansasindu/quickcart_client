import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { CookieManagerService } from '../../../../services/cookie-manager.service';
import { CartService } from '../../../../services/cart.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {LoadingSpinnerComponent} from '../../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCheckbox,
    FormsModule,
    MatButton,
    NgIf,
    LoadingSpinnerComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  returnUrl: string = '/';

  constructor(private userService: AuthService,
              private cookieService: CookieManagerService,
              private router: Router,
              private route: ActivatedRoute,
              private cartService: CartService) {
  }

  loading = false;
  showState = false;
  form = new FormGroup({
    email: new FormControl('',
      [Validators.email, Validators.required,
        Validators.minLength(3)]),
    password: new FormControl('',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[@&$])[A-Za-z0-9@&$]{6,}$/)
      ])
  });

  login() {
    this.loading = true;
    this.userService.login(
      this.form.get('email')?.value!,
      this.form.get('password')?.value!
    ).subscribe(response => {
      this.cookieService.set(response?.data?.access_token, 'access_token');
      this.cookieService.set(response?.data?.refresh_token, 'refresh_token');
      this.cartService.reloadCart();
      this.loading = false;
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      this.loading = false;
    })
  }

  ngOnInit(): void {
    if (this.cookieService.tokenIsExists('access_token')) {
      this.router.navigate(['/sign-out']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
}
