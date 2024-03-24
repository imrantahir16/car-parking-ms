import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

declare const $: any;

@Component({
  selector: 'app-consumers',
  templateUrl: './consumers.component.html',
  styleUrls: ['./consumers.component.css']
})
export class ConsumersComponent implements OnInit {

  userId: string;
  consumers: any[];
  editConsumerModal: any;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService
  ) {
    this.userId = '';
    this.consumers = [];
    this.setEditConsumerModal();
  }

  ngOnInit(): void {
    this.getConsumers();
  }

  setEditConsumerModal(): void {
    this.editConsumerModal = {
      fName: '',
      username: '',
      email: '',
      address: '',
      birthDate: '',
      driverLicense: '',
      vehiclePlate: '',
      bankAccount: ''
    };
  }

  getConsumers() {
    this._loader.start();
    this._apiService.GetData('users', 'userType/consumer_id').subscribe((res: any) => {
      if (res) {
        this.consumers = res;
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

  openDeleteConsumerDialog(userId: string): void {
    this.userId = userId;
    $('#deleteConsumerModal').modal('show');
  }

  deleteConsumer() {
    this._loader.start();
    this._apiService.DeleteData('users', this.userId).subscribe((res: any) => {
      if (res) {
        $('#deleteConsumerModal').modal('hide');
        this.getConsumers();
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

  openUpdateConsumerDialog(consumer: any): void {
    this.userId = consumer._id;
    const date = new Date(consumer.birthDate);
    const dob = date.toISOString().substring(0, 10);
    this.editConsumerModal = {
      fName: consumer.fName,
      username: consumer.username,
      email: consumer.email,
      address: consumer.address,
      birthDate: dob,
      driverLicense: consumer.driverLicense,
      vehiclePlate: consumer.vehiclePlate,
      bankAccount: consumer.bankAccount,
    };
    $('#editingConsumerModal').modal('show');
  }

  checkUpdateConsumerValidation(): boolean {

    if (this.editConsumerModal.fName === '') {
      this._toastr.error('Please enter name', 'Error!');
      return false;
    }

    if (this.editConsumerModal.username === '') {
      this._toastr.error('Please enter username', 'Error!');
      return false;
    }

    if (this.editConsumerModal.email === '') {
      this._toastr.error('Please enter email', 'Error!');
      return false;
    }

    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!filter.test(this.editConsumerModal.email)) {
      this._toastr.error('Invalid email address', 'Error!');
      return false;
    }

    if (this.editConsumerModal.address === '') {
      this._toastr.error('Please enter address', 'Error!');
      return false;
    }

    if (this.editConsumerModal.birthDate === '') {
      this._toastr.error('Please enter birth date', 'Error!');
      return false;
    }

    if (this.editConsumerModal.driverLicense === '') {
      this._toastr.error('Please enter driver license', 'Error!');
      return false;
    }

    if (this.editConsumerModal.vehiclePlate === '') {
      this._toastr.error('Please enter vehicle plate', 'Error!');
      return false;
    }

    if (this.editConsumerModal.bankAccount === '') {
      this._toastr.error('Please enter bank account', 'Error!');
      return false;
    }

    return true;
  }

  updateConsumer() {
    // Check Validation
    let isValid = this.checkUpdateConsumerValidation();
    if (!isValid) {
      return;
    }
    this._loader.start();
    this._apiService.PutData('users', this.userId, this.editConsumerModal).subscribe((res: any) => {
      if (res) {
        $('#editingConsumerModal').modal('hide');
        this.getConsumers();
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

  openViewConsumerDialog(consumer: any): void {
    this.userId = consumer._id;
    const date = new Date(consumer.birthDate);
    const dob = date.toISOString().substring(0, 10);
    this.editConsumerModal = {
      fName: consumer.fName,
      username: consumer.username,
      email: consumer.email,
      address: consumer.address,
      birthDate: dob,
      driverLicense: consumer.driverLicense,
      vehiclePlate: consumer.vehiclePlate,
      bankAccount: consumer.bankAccount,
    };
    $('#viewConsumerModal').modal('show');
  }

}
