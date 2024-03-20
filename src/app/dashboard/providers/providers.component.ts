import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

declare const $: any;

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent {
  userId: string;
  providers: any[];
  editProviderModal: any;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService
  ) {
    this.userId = '';
    this.providers = [];
    this.setEditProviderModal();
  }

  ngOnInit(): void {
    this.getProviders();
  }

  setEditProviderModal(): void {
    this.editProviderModal = {
      fName: '',
      username: '',
      email: '',
      address: '',
      bankAccount: '',
      parkings: []
    };
  }

  getProviders() {
    this._loader.start();
    this._apiService.GetData('users', 'userType?userType=provider_id').subscribe((res: any) => {
      if (res) {
        this.providers = res;
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

  openDeleteProviderDialog(userId: string): void {
    this.userId = userId;
    $('#deleteProviderModal').modal('show');
  }

  deleteProvider() {
    this._loader.start();
    this._apiService.DeleteData('users', this.userId).subscribe((res: any) => {
      if (res) {
        $('#deleteProviderModal').modal('hide');
        this.getProviders();
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

  openUpdateProviderDialog(provider: any): void {
    this.userId = provider._id;
    const date = new Date(provider.birthDate);
    const dob = date.toISOString().substring(0, 10);
    this.editProviderModal = {
      fName: provider.fName,
      username: provider.username,
      email: provider.email,
      address: provider.address,
      birthDate: dob,
      driverLicense: provider.driverLicense,
      vehiclePlate: provider.vehiclePlate,
      bankAccount: provider.bankAccount,
      parkings: provider.parkings
    };
    $('#editingProviderModal').modal('show');
  }

  checkUpdateProviderValidation(): boolean {
    if (this.editProviderModal.fName === '') {
      this._toastr.error('Please enter name', 'Error!');
      return false;
    }

    if (this.editProviderModal.username === '') {
      this._toastr.error('Please enter username', 'Error!');
      return false;
    }

    if (this.editProviderModal.email === '') {
      this._toastr.error('Please enter email', 'Error!');
      return false;
    }

    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(this.editProviderModal.email)) {
      this._toastr.error('Invalid email address', 'Error!');
      return false;
    }

    if (this.editProviderModal.address === '') {
      this._toastr.error('Please enter address', 'Error!');
      return false;
    }

    if (this.editProviderModal.bankAccount === '') {
      this._toastr.error('Please enter bank account', 'Error!');
      return false;
    }

    return true;
  }

  updateProvider() {
    // Check Validation
    let isValid = this.checkUpdateProviderValidation();
    if (!isValid) {
      return;
    }
    this._loader.start();
    this._apiService.PutData('users', this.userId, this.editProviderModal).subscribe((res: any) => {
      if (res) {
        $('#editingProviderModal').modal('hide');
        this.getProviders();
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

  openViewProviderDialog(provider: any): void {
    this.userId = provider._id;
    const date = new Date(provider.birthDate);
    const dob = date.toISOString().substring(0, 10);
    this.editProviderModal = {
      fName: provider.fName,
      username: provider.username,
      email: provider.email,
      address: provider.address,
      birthDate: dob,
      driverLicense: provider.driverLicense,
      vehiclePlate: provider.vehiclePlate,
      bankAccount: provider.bankAccount,
      parkings: provider.parkings
    };
    $('#viewProviderModal').modal('show');
  }
}
