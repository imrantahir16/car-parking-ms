import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

declare const $: any;

@Component({
  selector: 'app-parking-lots',
  templateUrl: './parking-lots.component.html',
  styleUrls: ['./parking-lots.component.css']
})
export class ParkingLotsComponent {

  parkingLots: any[];
  parkingId: string;
  editParkingLotModal: any;

  constructor(
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService
  ) {
    this.parkingId = '';
    this.parkingLots = [];
    this.setEditParkingLotModal();
  }

  ngOnInit(): void {
    this.getParkingLots();
  }

  setEditParkingLotModal(): void {
    this.editParkingLotModal = {
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
        this.parkingLots = this.parkingLots.filter(x => x.provider !== null);
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

}
