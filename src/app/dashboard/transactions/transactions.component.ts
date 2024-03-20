import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  isAdmin: boolean;
  userInfo: any;
  searchTerm: string;
  payments: any[];
  totalRevenue: number;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.isAdmin = false;
    this.searchTerm = '';
    this.totalRevenue = 0;
    this.payments = [];
  }

  ngOnInit(): void {
    if (this.userInfo.userName === 'admin') {
      this.getRevenue();
      this.getPayments();
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
      this.getProviderConsumerPayments();
    }

  }

  getProviderConsumerPayments() {
    this._loader.start();
    this._apiService.GetData('payments', this.userInfo.userType === 'provider_id' ? `payments/provider/${this.userInfo.id}` : `payments/consumer/${this.userInfo.id}`).subscribe((res: any) => {
      if (res) {
        this.payments = res;
        for (var i = 0; i < this.payments.length; i++) {
          if (this.userInfo.userType === 'provider_id') {
            this.totalRevenue += this.payments[i].totalAmountPaid - this.payments[i].websiteRevenue;
          } else {
            this.totalRevenue += this.payments[i].totalAmountPaid
          }
        }
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

  getPayments() {
    this._loader.start();
    this._apiService.GetData('payments', 'payments').subscribe((res: any) => {
      if (res) {
        this.payments = res;
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

  getRevenue() {
    this._loader.start();
    this._apiService.GetData('payments', 'getRevenue').subscribe((res: any) => {
      if (res) {
        this.totalRevenue = res.revenue;
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
