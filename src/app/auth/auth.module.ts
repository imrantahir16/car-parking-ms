import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    PasswordStrengthMeterComponent
  ]
})
export class AuthModule { }
