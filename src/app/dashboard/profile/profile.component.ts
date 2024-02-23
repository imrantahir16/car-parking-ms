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
  userModal: any;
  isEdit: boolean = false;
  

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router,
  ) {
    this.setAuthRequestModal();
  }

  setAuthRequestModal(): void {
    this.userModal = {
      userType: 'provider'
    };
  }

  toggleEditProfile() {
    this.isEdit = !this.isEdit;
  }

  SaveProfile() {
    console.log(this.userModal);
  }
}
