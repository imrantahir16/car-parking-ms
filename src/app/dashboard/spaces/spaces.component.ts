import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiCallingService } from 'src/app/shared/generic-api-calling.service';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css']
})
export class SpacesComponent implements OnInit {

  searchTerm:string =  '';
  parkingLots: any[];

  userType: string = 'consumer';
  isSearchResultByDate: boolean = false;
  isSearchResultByLocation: boolean = false;

  userInfo: any;

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiCallingService,
    private _loader: NgxUiLoaderService,
    private _toastr: ToastrService) {
    this.userInfo = JSON.parse(localStorage.getItem('user') || '');
    this.parkingLots = [];
  }

  ngOnInit(): void {
    this.getParkingLots();
    this._route.queryParams.subscribe((p: any) => {
      this.userType = p.userType;
      this.isSearchResultByLocation = false;
      this.isSearchResultByDate = false;
    });
  }

  getParkingLots() {
    this._loader.start();
    this._apiService.GetData('parkings', '').subscribe((res: any) => {
      if (res) {
        this.parkingLots = res;
        if(this.userInfo.userType === 'provider_id') {
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

  searchSpacesByDate() {
    this.isSearchResultByDate = true;
  }

  searchSpacesByLocation() {
    this.isSearchResultByLocation = true;
  }

}
