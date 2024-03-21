import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetPasswordModal: any;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    this.setResetPasswordModal();
  }

  setResetPasswordModal(): void {
    this.resetPasswordModal = {
      email: localStorage.getItem('email'),
      code: localStorage.getItem('otp'),
      password: '',
      passwordStrength: 0,
      confirmPassword: '',
      confirmPasswordStrength: 0
    }
  }

  passwordStengthChecker(strength: any): void {
    this.resetPasswordModal.passwordStrength = strength;
  }

  confirmPasswordStengthChecker(strength: any): void {
    this.resetPasswordModal.confirmPasswordStrength = strength;
  }

  checkValidation(): boolean {

    if (this.resetPasswordModal.email === '') {
      this._toastr.error('Please enter email', 'Error!');
      return false;
    }

    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(this.resetPasswordModal.email)) {
      this._toastr.error('Invalid email address', 'Error!');
      return false;
    }

    if (this.resetPasswordModal.password === '') {
      this._toastr.error('Please enter password', 'Error!');
      return false;
    }

    if (this.resetPasswordModal.passwordStrength < 4) {
      this._toastr.error('Please meet password strength criteria', 'Error!');
      return false;
    }

    if (this.resetPasswordModal.confirmPassword === '') {
      this._toastr.error('Please enter confirm password', 'Error!');
      return false;
    }

    if (this.resetPasswordModal.confirmPasswordStrength < 4) {
      this._toastr.error('Please meet password strength criteria', 'Error!');
      return false;
    }

    if (this.resetPasswordModal.password.trim() !== this.resetPasswordModal.confirmPassword.trim()) {
      this._toastr.error('Password do not match', 'Error!');
      return false;
    }

    return true;
  }

  resetPassword() {

    if (!this.checkValidation()) return;

    this._loader.start();
    this._apiService.PostData('users', 'reset', this.resetPasswordModal).subscribe((res: any) => {
      if (res) {
        this._toastr.success(res.message, 'Success!');
        setTimeout(() => {
          this._router.navigate(['/']);
        }, 2000);
        this._loader.stop();
      }
      else {
        this._loader.stop();
        this._toastr.error(res.message, 'Error!');
      }
    }, (err: any) => {
      this._loader.stop();
      this._toastr.error('Connection Problem', 'Error!');
    })

  }

}
