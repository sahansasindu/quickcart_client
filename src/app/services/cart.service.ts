import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) {
  }


  public register(email: string, password: string, firstName: any, lastName: any): Observable<any> {
    return this.http.post(this.baseUrl + "user-service/api/v1/users/signup", {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      createdDate: new Date()
    })
  }

  public verifyEmail(email: any, otp: any): Observable<any> {
    const params = {otp: otp, email: email};
    return this.http.post(this.baseUrl + "user-service/api/v1/users/verify-email", null,
      {params: params})
  }

  public verifyResetPasswordCode(email: any, otp: any): Observable<any> {
    const params = {otp: otp, email: email};
    return this.http.post(this.baseUrl + "user-service/api/v1/users/verify-reset", null,
      {params: params})
  }

  public sendEmail(email: any): Observable<any> {
    const params = {email: email};
    return this.http.post(this.baseUrl + "user-service/api/v1/users/forgot-password-request-code", null,
      {params: params})
  }

  public resendVerificationCode(email: any): Observable<any> {
    const params = {email: email};
    return this.http.post(this.baseUrl + "user-service/api/v1/users/resend", null,
      {params: params})
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + "user-service/api/v1/users/login", {
      "username": email,
      "password": password
    })
  }

  public resetPassword(email: any, code: any, password: any): Observable<any> {
    return this.http.post(this.baseUrl + "user-service/api/v1/users/reset-password", {
      "email": email,
      "code": code,
      "password": password
    })
  }


  public createAvatar(
    formData:FormData
  ): Observable<any> {
    return this.http.post(this.baseUrl + 'user-service/api/v1/avatars/user/manage-avatar',formData);
  }
}
