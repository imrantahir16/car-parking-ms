import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [NgOtpInputModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {
  user: any;
  otpRequest: any;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    // this.user = this._authService.getUser();
    // if (!this.user) this._router.navigate(['/']);
    this.setOTPModal();
  }

  setOTPModal(): void {
    this.otpRequest = {
      // email: this.user.email,
      code: ''
    }
  }

  checkValidation(): boolean {

    if (this.otpRequest.email === '') {
      this._toastr.error('Please enter email', 'Error!');
      return false;
    }

    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(this.otpRequest.email)) {
      this._toastr.error('Invalid email address', 'Error!');
      return false;
    }

    if (this.otpRequest.code === '') {
      this._toastr.error('Please enter otp code', 'Error!');
      return false;
    }

    return true;
  }

  onOtpChange(code: string): void {
    this.otpRequest.code = code;
  }

  verifyOTP() {
    // if (!this.checkValidation()) return;
    // this._loader.start();
    // this._apiService.PostData('user', 'verifyOTP', this.otpRequest).subscribe((res: any) => {
    //   if (res.success) {
    //     this._toastr.success(res.message, 'Success!');
    //     this._authService.setOTP(res.data.code);
    //     this._authService.setUser(res.data.user);
    //     setTimeout(() => {
    //       this._router.navigate(['/reset-password']);
    //     }, 2000);
    //     this._loader.stop();
    //   }
    //   else {
    //     this._loader.stop();
    //     this._toastr.error(res.message, 'Error!');
    //   }
    // }, (err: any) => {
    //   this._loader.stop();
    //   this._toastr.error('Connection Problem', 'Error!');
    // })

    // temp
    console.log(this.otpRequest.code);
    this._router.navigate(['/auth/reset-password']);
  }
}
