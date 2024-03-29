import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

declare const $: any;

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css']
})
export class SpacesComponent implements OnInit {

  searchTerm: string = '';
  parkingLots: any[];
  reviews: any[];

  userType: string = 'consumer';
  userInfo: any;

  parkingId: string;
  editParkingLotModal: any;
  addPromoModal: any;

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.parkingLots = [];
    this.reviews = [];
    this.parkingId = '';
    this.setAddPromoModal();
    this.setEditParkingLotModal();
  }

  ngOnInit(): void {
    this.getParkingLots();
    this._route.queryParams.subscribe((p: any) => {
      this.userType = p.userType;
    });
  }

  setAddPromoModal(): void {
    this.addPromoModal = {
      parkingId: '',
      promoDate: '',
      promoDiscount: '',
      isUpdate: false
    }
  }

  setEditParkingLotModal(): void {
    this.editParkingLotModal = {
      providerId: this.userInfo.id,
      availableSpaces: '',
      reservedSpaces: '',
      spaces: '',
      carType: '',
      hourRate: '',
      address: '',
      rate: ''
    }
  }

  getParkingLots() {
    this._loader.start();
    this._apiService.GetData('parkings', '').subscribe((res: any) => {
      if (res) {

        this.parkingLots = res;
        const currentDate: Date = new Date();

        for (var i = 0; i < this.parkingLots.length; i++) {

          if (this.parkingLots[i].promoDate) {
            if (new Date(this.parkingLots[i].promoDate) > currentDate) {
              this.parkingLots[i].isPromo = true;
            } else {
              this.parkingLots[i].isPromo = false;
            }
          } else {
            this.parkingLots[i].isPromo = false;
          }

        }

        if (this.userInfo.userType === 'provider_id') {
          this.parkingLots = this.parkingLots.filter(x => x.provider !== null);
          this.parkingLots = this.parkingLots.filter(x => x.providerId === this.userInfo.id);
        } else {
          this.parkingLots = this.parkingLots.filter(x => x.provider !== null);
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

  openDeleteParkingLotDialog(parkingId: string): void {
    this.parkingId = parkingId;
    $('#deleteParkingLotModal').modal('show');
  }

  deleteParkingLot(): void {
    this._loader.start();
    this._apiService.DeleteData('parkings', this.parkingId).subscribe((res: any) => {
      if (res) {
        $('#deleteParkingLotModal').modal('hide');
        this.getParkingLots();
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

  openUpdateParkingLotDialog(parkingLot: any): void {
    this.parkingId = parkingLot._id;
    this.editParkingLotModal = {
      spaces: parkingLot.spaces,
      availableSpaces: parkingLot.spaces,
      reservedSpaces: parkingLot.reservedSpaces,
      carType: parkingLot.carType,
      hourRate: parkingLot.hourRate,
      address: parkingLot.address,
      rate: parkingLot.rate
    }
    $('#editingParkingLotModal').modal('show');
  }

  checkUpdateParkingLotValidation(): boolean {

    if (this.editParkingLotModal.address === '') {
      this._toastr.error('Please enter address', 'Error!');
      return false;
    }

    if (this.editParkingLotModal.spaces === '') {
      this._toastr.error('Please enter available spaces', 'Error!');
      return false;
    }

    if (this.editParkingLotModal.carType === '') {
      this._toastr.error('Please enter car type', 'Error!');
      return false;
    }

    if (this.editParkingLotModal.hourRate === '') {
      this._toastr.error('Please enter hourly rate', 'Error!');
      return false;
    }

    if (this.editParkingLotModal.rate === '') {
      this._toastr.error('Please enter daily rate', 'Error!');
      return false;
    }

    return true;
  }

  updateParkingLot() {
    // Check Validation
    let isValid = this.checkUpdateParkingLotValidation();
    if (!isValid) {
      return;
    }
    this.editParkingLotModal.availableSpaces = this.editParkingLotModal.spaces;
    this._loader.start();
    this._apiService.PutData('parkings', this.parkingId, this.editParkingLotModal).subscribe((res: any) => {
      if (res) {
        $('#editingParkingLotModal').modal('hide');
        this.getParkingLots();
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

  openViewProviderDialog(parkingLot: any): void {
    this.parkingId = parkingLot._id;
    this.editParkingLotModal = {
      spaces: parkingLot.spaces,
      carType: parkingLot.carType,
      hourRate: parkingLot.hourRate,
      address: parkingLot.address,
      rate: parkingLot.rate
    }
    $('#viewParkingLotModal').modal('show');
  }

  openAddParkingLotDialog(): void {
    $('#addParkingLotModal').modal('show');
  }

  addParkingLot() {
    // Check Validation
    let isValid = this.checkUpdateParkingLotValidation();
    if (!isValid) {
      return;
    }
    this._loader.start();
    this._apiService.PostData('parkings', 'create', this.editParkingLotModal).subscribe((res: any) => {
      if (res) {
        $('#addParkingLotModal').modal('hide');
        this.getParkingLots();
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

  showReviews(reviews: any[]): void {
    this.reviews = reviews;
    $('#viewReviewsModal').modal('show');
  }

  showAddPromoDialog(parking: any): void {
    this.addPromoModal.parkingId = parking._id;
    if (parking.isPromo) {
      this.addPromoModal.promoDate = parking.promoDate;
      this.addPromoModal.promoDiscount = parking.promoDiscount;
      this.addPromoModal.isUpdate = true;
    } else {
      this.addPromoModal.isUpdate = false;
    }

    $('#addParkingPromoModal').modal('show');
  }

  checkAddPromoValidation(): boolean {
    if (this.addPromoModal.parkingId === '') {
      this._toastr.error('Please enter address', 'Error!');
      return false;
    }

    if (this.addPromoModal.promoDate === '') {
      this._toastr.error('Please enter promo date', 'Error!');
      return false;
    }

    if (this.addPromoModal.promoDiscount === '') {
      this._toastr.error('Please enter promo discount', 'Error!');
      return false;
    }

    return true;
  }

  addPromo() {
    // Check Validation
    let isValid = this.checkAddPromoValidation();
    if (!isValid) {
      return;
    }
    this._loader.start();
    this._apiService.PostData('parkings', 'addPromo', this.addPromoModal).subscribe((res: any) => {
      if (res) {
        this._loader.stop();
        $('#addParkingPromoModal').modal('hide');
        this.setAddPromoModal();
        this.getParkingLots();
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
