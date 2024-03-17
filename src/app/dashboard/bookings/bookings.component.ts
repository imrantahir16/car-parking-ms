import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  userType: string = 'consumer';
  stars: number[] = [1, 2, 3, 4, 5]; // Array to represent 5 stars
  selectedServiceRating: number = 0;
  selectedHygieneRating: number = 0;
  selectedSafteyRating: number = 0;

  userInfo: any;
  bookings: any[];

  constructor(private route: ActivatedRoute,
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.bookings = [];
  }

  ngOnInit(): void {
    this.getBookings();
    this.route.queryParams.subscribe((p: any) => {
      this.userType = p.userType;
    });
  }

  getBookings() {
    this._loader.start();
    this._apiService.GetData('bookings', this.userInfo.id).subscribe((res: any) => {
      if (res) {
        this.bookings = res;
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

  selectServiceRating(rating: number): void {
    this.selectedServiceRating = rating;
  }
  selectHygieneRating(rating: number): void {
    this.selectedHygieneRating = rating;
  }
  selectSafteyRating(rating: number): void {
    this.selectedSafteyRating = rating;
  }



}
