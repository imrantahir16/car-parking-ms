import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

declare const $: any;

@Component({
  selector: 'app-space-detail',
  templateUrl: './space-detail.component.html',
  styleUrls: ['./space-detail.component.css']
})
export class SpaceDetailComponent {

  userInfo: any;
  parkingId: string;
  parkingLot: any;
  timeOptions: { value: string, label: string }[] = [];
  bookingRequestModal: any;

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.parkingLot = {};
    this.parkingId = '';
    this.setBookingRequestModal();
  }

  ngOnInit(): void {
    this.generateTimeOptions();
    this._route.paramMap.subscribe(params => {
      this.parkingId = params.get('id') || '';
      this.getParkingLot();
    });
  }

  setBookingRequestModal(): void {
    this.bookingRequestModal = {
      reservationDate: '',
      checkInTime: '',
      checkOutTime: '',
      hourDifference: '',
      isHourly: true,
      price: '',
      totalPrice: '',
      isAgreement: false,
      showCheckout: false,
      name: '',
      cardNumber: '',
      cvc: '',
      validity: ''
    }
  }

  showPayment(): void {
    if (!this.bookingRequestModal.isAgreement) {
      this._toastr.error('Please agree to terms & conditions', 'Error!');
      return;
    }
    this.bookingRequestModal.showCheckout = true;
    $('#reservationModal').modal('hide');
  }

  selectPaymentOption(event: any, isHourly: boolean): void {
    this.bookingRequestModal.isHourly = isHourly;
    this.bookingRequestModal.price = Number(event.target.value);
  }

  generateTimeOptions() {
    for (let hour = 12; hour <= 24; hour++) {
      for (let minute of ['00', '15', '30', '45']) {
        const timeLabel = `${hour < 10 ? '0' + hour : hour}:${minute}`;
        this.timeOptions.push({ value: timeLabel, label: timeLabel });
      }
    }
  }

  calculateTimeDifference() {
    if (this.bookingRequestModal.checkInTime && this.bookingRequestModal.checkOutTime) {
      const startTimeDate = new Date(`2000-01-01T${this.bookingRequestModal.checkInTime}`);
      const endTimeDate = new Date(`2000-01-01T${this.bookingRequestModal.checkOutTime}`);

      const timeDiff = endTimeDate.getTime() - startTimeDate.getTime();
      this.bookingRequestModal.hourDifference = Math.abs(timeDiff / (1000 * 60 * 60)); // Convert milliseconds to hours

      if (this.bookingRequestModal.isHourly) {
        if (this.bookingRequestModal.hourDifference <= 0) {
          this._toastr.error('Checkout time must be greater then checkin time', 'Error!');
        }
      }
    }
  }

  getParkingLot(): void {
    this._loader.start();
    this._apiService.GetData('parkings', this.parkingId).subscribe((res: any) => {
      if (res) {
        this.parkingLot = res;
        const currentDate: Date = new Date();
        if (this.parkingLot.promoDate) {

          if (new Date(this.parkingLot.promoDate) > currentDate) {
            this.parkingLot.isPromo = true;
          } else {
            this.parkingLot.isPromo = false;
          }

        } else {
          this.parkingLot.isPromo = false;
        }
        this.bookingRequestModal.price = this.parkingLot.hourRate;
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

  proceedCheckOut(): void {

    if (this.bookingRequestModal.reservationDate === '') {
      this._toastr.error('Please choose reservation date', 'Error!');
      return;
    }

    // check validation
    if (this.bookingRequestModal.isHourly) {

      if (this.bookingRequestModal.checkInTime === '') {
        this._toastr.error('Please choose checkin time', 'Error!');
        return;
      }

      if (this.bookingRequestModal.checkOutTime === '') {
        this._toastr.error('Please choose checkout time', 'Error!');
        return;
      }

      if (this.bookingRequestModal.hourDifference <= 0) {
        this._toastr.error('Checkout time must be greater then checkin time', 'Error!');
      }

      this.bookingRequestModal.totalPrice = this.bookingRequestModal.price * this.bookingRequestModal.hourDifference;

    } else {
      this.bookingRequestModal.totalPrice = this.bookingRequestModal.price;
    }

    // checking discount
    if (this.parkingLot.isPromo) {
      if (new Date(this.bookingRequestModal.reservationDate).toDateString() === new Date(this.parkingLot.promoDate).toDateString()) {
        // apply discount
        const discount = this.bookingRequestModal.totalPrice * this.parkingLot.promoDiscount / 100;
        this.bookingRequestModal.totalPrice = this.bookingRequestModal.totalPrice - discount;
      }
    }

    $('#reservationModal').modal('show');
  }

  payNow(): void {

    if (this.bookingRequestModal.name === '') {
      this._toastr.error('Please enter name on card', 'Error!');
      return;
    }

    if (this.bookingRequestModal.cardNumber === '') {
      this._toastr.error('Please enter card number', 'Error!');
      return;
    }

    if (this.bookingRequestModal.cvc === '') {
      this._toastr.error('Please enter cvc', 'Error!');
      return;
    }

    if (this.bookingRequestModal.validity === '') {
      this._toastr.error('Please enter validity of card', 'Error!');
      return;
    }

    let requestModal = {
      parkingId: this.parkingId,
      consumerId: this.userInfo.id,
      arrivalTime: this.bookingRequestModal.checkInTime,
      checkoutTime: this.bookingRequestModal.checkOutTime,
      totalAmount: this.bookingRequestModal.totalPrice,
      rateCost: this.bookingRequestModal.price,
      nominal: this.bookingRequestModal.totalPrice,
      parkId: this.parkingId,
      provider: this.parkingLot.provider?._id,
      customerId: this.userInfo.id,
      name: this.userInfo.name,
      dataBooking: this.bookingRequestModal.reservationDate,
      creditCard: {
        nameOnCard: this.bookingRequestModal.name,
        cardNumber: this.bookingRequestModal.cardNumber,
        cc: this.bookingRequestModal.cvc,
        expiry: this.bookingRequestModal.validity
      }
    }

    this._loader.start();
    this._apiService.PostData('payments', 'create', requestModal).subscribe((res: any) => {
      if (res) {
        this._toastr.success('Booking confirmed successfully!', 'Success!');
        this._router.navigate(['/dashboard/bookings'], { queryParams: { userType: 'consumer' } });
        this.setBookingRequestModal();
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
