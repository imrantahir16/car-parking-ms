import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  authRequestModal: any;
  signupAs: string = 'consumer'

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router,
  ) {
    this.setAuthRequestModal();
  }

  setAuthRequestModal(): void {
    this.authRequestModal = {
      userType: this.signupAs,
      fName: '',
      username: '',
      email: '',
      password: '',
      passwordStrength: 0,
      confirmPassword: '',
      confirmPasswordStrength: 0,
      address: '',
      birthDate: '',
      driverLicense: '',
      vehiclePlate: '',
      bankAccount: '',
      // provider
      spaces: '',
      carType: '',
      hourRate: '',
      rate: ''
    };
  }

  passwordStengthChecker(strength: any): void {
    this.authRequestModal.passwordStrength = strength;
  }

  confirmPasswordStengthChecker(strength: any): void {
    this.authRequestModal.confirmPasswordStrength = strength;
  }

  checkValidation(): boolean {

    if (this.authRequestModal.fName === '') {
      this._toastr.error('Please enter name', 'Error!');
      return false;
    }

    if (this.authRequestModal.username === '') {
      this._toastr.error('Please enter username', 'Error!');
      return false;
    }

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

    if (this.authRequestModal.passwordStrength < 4) {
      this._toastr.error('Please meet password strength criteria', 'Error!');
      return false;
    }

    if (this.authRequestModal.confirmPassword === '') {
      this._toastr.error('Please enter confirm password', 'Error!');
      return false;
    }

    if (this.authRequestModal.confirmPasswordStrength < 4) {
      this._toastr.error('Please meet password strength criteria', 'Error!');
      return false;
    }

    if (this.authRequestModal.confirmPassword !== this.authRequestModal.password) {
      this._toastr.error('Password do not matched', 'Error!');
      return false;
    }

    if (this.authRequestModal.address === '') {
      this._toastr.error('Please enter address', 'Error!');
      return false;
    }

    if (this.signupAs === 'consumer') {
      if (this.authRequestModal.birthDate === '') {
        this._toastr.error('Please enter birth date', 'Error!');
        return false;
      }

      if (this.authRequestModal.driverLicense === '') {
        this._toastr.error('Please enter driver license', 'Error!');
        return false;
      }

      if (this.authRequestModal.vehiclePlate === '') {
        this._toastr.error('Please enter vehicle plate', 'Error!');
        return false;
      }
    }

    if (this.authRequestModal.bankAccount === '') {
      this._toastr.error('Please enter bank account', 'Error!');
      return false;
    }

    if (this.signupAs === 'provider') {

      if (this.authRequestModal.spaces === '') {
        this._toastr.error('Please enter car spaces', 'Error!');
        return false;
      }

      if (this.authRequestModal.carType === '') {
        this._toastr.error('Please enter car type', 'Error!');
        return false;
      }

      if (this.authRequestModal.hourRate === '') {
        this._toastr.error('Please enter hour rate', 'Error!');
        return false;
      }

      if (this.authRequestModal.rate === '') {
        this._toastr.error('Please enter daily rate', 'Error!');
        return false;
      }
    }

    return true;
  }

  register() {
    // Check Validation
    let isValid = this.checkValidation();
    if (!isValid) {
      return;
    }
    this._loader.start();
    this.authRequestModal.userType = this.signupAs;
    this._apiService.PostData('users', 'signup', this.authRequestModal).subscribe((res: any) => {
      if (res) {
        this._toastr.success('User is registered successfully!', 'Success!');
        this.setAuthRequestModal();
        const user = {
          userType: res.userType,
          id: res.id,
          email: res.email,
          address: res.address,
          userName: res.userName,
          name: res.name
        }
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', res.token);
        this._loader.stop();
        setTimeout(() => {
          this._router.navigate(['/dashboard/spaces'], { queryParams: { userType: res.userType === 'provider_id' ? 'provider' : 'consumer' } });
        }, 1000);
        this._loader.stop();
      }
      else {
        this._loader.stop();
        this._toastr.error(res.data.message, 'Error!');
      }
    }, (err: any) => {
      this._loader.stop();
      this._toastr.error(err.error.message, 'Error!');
    })

  }
}
