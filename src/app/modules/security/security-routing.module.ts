import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SecurityContextComponent} from "./component/security-context/security-context.component";
import {LoginComponent} from "./component/login/login.component";
import {SignupComponent} from "./component/signup/signup.component";
import {ForgotPasswordComponent} from "./component/forgot-password/forgot-password.component";
import {OtpVerificationComponent} from "./component/otp-verification/otp-verification.component";
import {ResetPasswordComponent} from "./component/reset-password/reset-password.component";


const routes: Routes = [
  {path:'',redirectTo:'/security/context',pathMatch:'full'},
  {path:'context',component:SecurityContextComponent,children:[
      {path:'',redirectTo:'/security/context/login',pathMatch:'full'},
      {path:'login',component:LoginComponent},
      {path:'signup',component:SignupComponent},
      {path:'forgot-password',component:ForgotPasswordComponent},
      {path:'confirm-otp',component:OtpVerificationComponent},
      {path:'reset-password',component:ResetPasswordComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
