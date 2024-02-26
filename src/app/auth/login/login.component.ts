import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authRequestModal: any;

  constructor(
    // private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router,
  ) {
    this.setAuthRequestModal();
  }

  setAuthRequestModal(): void {
    this.authRequestModal = {
      email: '',
      password: '',
    };
  }

  
  login() {
    // let isValid = this.checkValidation();
    // if (!isValid) {
    //   return;
    // }
    // this._loader.start();
    // this._apiService.PostData('Auth', 'login', this.authRequestModal).subscribe((res: any) => {
    //   if (res.success) {
    //     localStorage.setItem('user', JSON.stringify(res.data.user));
    //     localStorage.setItem('token', res.data.token);
    //     this._loader.stop();
    //     setTimeout(() => {
    //       this._router.navigate(['/dashboard']);
    //     }, 1000);

    //   }
    //   else {
    //     this._loader.stop();
    //     this._toastr.error(res.data.message, 'Error!');
    //   }
    // }, (err: any) => {
    //   this._loader.stop();
    //   this._toastr.error('Connection Problem', 'Error!');
    // })

    // simulating fake login
    this._loader.start();
    setTimeout(() => {
      this._loader.stop();
      this._router.navigate(['/dashboard']);
    }, 1000);
  }


  checkValidation(): boolean {

    if (this.authRequestModal.email === '') {
      this._toastr.error('Please enter email', 'Error!');
      return false;
    }

    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(this.authRequestModal.email)) {
      this._toastr.error('Invalid email address', 'Error!');
      return false;
    }

    if (this.authRequestModal.password === '') {
      this._toastr.error('Please enter password', 'Error!');
      return false;
    }

    return true;
  }

}
