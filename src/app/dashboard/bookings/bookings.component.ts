import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

declare const $: any;

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  userType: string = 'consumer';
  stars: number[] = [1, 2, 3, 4, 5]; // Array to represent 5 stars

  userInfo: any;
  booking: any
  bookings: any[];
  confirmedBookings: any[];
  bookingId: string;
  addReviewModal: any;

  constructor(private route: ActivatedRoute,
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.addReviewModal = {};
    this.bookings = [];
    this.confirmedBookings = [];
    this.bookingId = '';
    this.setAddReviewModal();
  }

  ngOnInit(): void {
    this.getBookings();
    this.route.queryParams.subscribe((p: any) => {
      this.userType = p.userType;
    });
  }

  setAddReviewModal(): void {
    this.addReviewModal = {
      providerId: '',
      parkingId: '',
      consumerId: '',
      consumerName: '',
      address: '',
      service: 0,
      hygeine: 0,
      security: 0,
      comment: ''
    }
  }

  getBookings() {
    this._loader.start();
    this._apiService.GetData('bookings', this.userInfo.userType === 'consumer_id' ? this.userInfo.id : `providerbookings/${this.userInfo.id}`).subscribe((res: any) => {
      if (res) {
        const currentDate: Date = new Date();
        this.confirmedBookings = res.filter((booking: any) => new Date(booking.dataBooking) < currentDate);
        for (var i = 0; i < this.confirmedBookings.length; i++) {
          const index = this.confirmedBookings[i].reviews.findIndex((x : any)=> x.consumerId === this.userInfo.id);
          if (index !== -1) {
            this.confirmedBookings[i].isReviewAdded = true;
          } else {
            this.confirmedBookings[i].isReviewAdded = false;
          }
        }
        this.bookings = res.filter((booking: any) => new Date(booking.dataBooking) > currentDate);
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

  openCancelBookingDialog(bookingId: string): void {
    this.bookingId = bookingId;
    $('#deleteBookingModal').modal('show');
  }

  cancelBooking(): void {
    this._loader.start();
    this._apiService.DeleteData('bookings', this.userInfo.userType === 'consumer_id' ? `consumer/${this.bookingId}` : `provider/${this.bookingId}`).subscribe((res: any) => {
      if (res) {
        this.getBookings();
        $('#deleteBookingModal').modal('hide');
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
    this.addReviewModal.service = rating;
  }

  selectHygieneRating(rating: number): void {
    this.addReviewModal.hygeine = rating;
  }

  selectSafteyRating(rating: number): void {
    this.addReviewModal.security = rating;
  }

  openAddReviewModal(booking: any): void {
    this.booking = booking;
    this.addReviewModal = {
      providerId: this.booking.providerId,
      parkingId: this.booking.parkingId,
      consumerId: this.booking.consumerId,
      consumerName: this.booking.consumer.fName,
      address: this.booking.parking.address,
      service: 0,
      hygeine: 0,
      security: 0,
      comment: ''
    }
    $('#reviewModal').modal('show');
  }

  checkReviewValidation(): boolean {

    if (this.addReviewModal.service === '') {
      this._toastr.error('Please choose service rating', 'Error!');
      return false;
    }

    if (this.addReviewModal.hygeine === '') {
      this._toastr.error('Please choose hygeine rating', 'Error!');
      return false;
    }

    if (this.addReviewModal.security === '') {
      this._toastr.error('Please choose security rating', 'Error!');
      return false;
    }

    if (this.addReviewModal.comment === '') {
      this._toastr.error('Please add comments', 'Error!');
      return false;
    }

    return true;
  }

  addReview(): void {
    let isValid = this.checkReviewValidation();
    if (!isValid) {
      return;
    }
    this._loader.start();
    this._apiService.PostData('reviews', 'create', this.addReviewModal).subscribe((res: any) => {
      if (res) {
        this._toastr.success('Review added successfully', 'Success!');
        this.setAddReviewModal();
        $('#reviewModal').modal('hide');
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

  openViewReviewModal(booking: any): void {
    this.booking = booking;
    const review = this.booking.reviews.find((x : any)=> x.consumerId === this.userInfo.id);
    this.addReviewModal = {
      providerId: this.booking.providerId,
      parkingId: this.booking.parkingId,
      consumerId: this.booking.consumerId,
      consumerName: this.booking.consumer.fName,
      address: this.booking.parking.address,
      service: review.service,
      hygeine: review.hygeine,
      security: review.security,
      comment: review.comment
    }
    $('#viewReviewModal').modal('show');
  }

}
