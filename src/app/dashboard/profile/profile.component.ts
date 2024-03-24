import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  userInfo: any;
  authRequestModal: any;
  isEdit: boolean = false;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.setAuthRequestModal();
  }

  ngOnInit(): void {
    this.getUser();
  }

  setAuthRequestModal(): void {
    this.authRequestModal = {
      userType: this.userInfo.userType === 'consumer_id' ? 'consumer' : 'producer',
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

  getUser() {
    this._loader.start();
    this._apiService.GetData('users', this.userInfo.id).subscribe((res: any) => {
      if (res) {
        this.authRequestModal = res;
        const date = new Date(this.authRequestModal.birthDate);
        const dob = date.toISOString().substring(0, 10);
        this.authRequestModal.birthDate = dob;
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

  updateUser() {
    this._loader.start();
    this._apiService.PutData('users', this.userInfo.id, this.authRequestModal).subscribe((res: any) => {
      if (res) {
        this.getUser();
        this.toggleEditProfile();
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

  toggleEditProfile() {
    this.isEdit = !this.isEdit;
  }

}
