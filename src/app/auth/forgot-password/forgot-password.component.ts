import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  forgetPasswordModal: any;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    this.setForgetPasswordModal();
  }

  setForgetPasswordModal(): void {
    this.forgetPasswordModal = {
      email: ''
    }
  }

  checkValidation(): boolean {

    if (this.forgetPasswordModal.email === '') {
      this._toastr.error('Please enter username or email', 'Error!');
      return false;
    }

    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(this.forgetPasswordModal.email)) {
      this._toastr.error('Invalid email address', 'Error!');
      return false;
    }

    return true;
  }

  forgetPassword() {
    if (!this.checkValidation()) return;
    this._loader.start();
    this._apiService.PostData('users', 'forget', this.forgetPasswordModal).subscribe((res: any) => {
      if (res) {
        localStorage.setItem('email', this.forgetPasswordModal.email);
        this._toastr.success(res.message, 'Success!');
        setTimeout(() => {
          this._router.navigate(['/otp']);
        }, 2000);
        this._loader.stop();
      }
      else {
        this._loader.stop();
        this._toastr.error(res.message, 'Error!');
      }
    }, (err: any) => {
      this._loader.stop();
      this._toastr.error(err.error.message, 'Error!');
    })

  }

  navigateToPassword(): void {
    this._router.navigate(['/auth/otp']);
  }
}
