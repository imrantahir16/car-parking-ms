import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css']
})
export class SpacesComponent implements OnInit{

  userType: string = 'consumer';
  isSearchResultByDate: boolean = false;
  isSearchResultByLocation: boolean = false;
  constructor(private route: ActivatedRoute){
    // this.route.queryParams.subscribe((p: any) => {
    //   this.userType = p.userType;   
    // });
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((p: any) => {
      this.userType = p.userType; 
      this.isSearchResultByLocation = false;
      this.isSearchResultByDate = false;  
    });
  }
  searchSpacesByDate() {
    this.isSearchResultByDate = true;
  }

  searchSpacesByLocation() {
    this.isSearchResultByLocation = true;
  }

}
