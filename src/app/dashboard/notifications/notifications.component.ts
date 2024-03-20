import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  userInfo: any;
  searchTerm: string;
  notifications: any[];

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.searchTerm = '';
    this.notifications = [];
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications() {
    this._loader.start();
    this._apiService.GetData('notification', this.userInfo.id).subscribe((res: any) => {
      if (res) {
        this.notifications = res;
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
