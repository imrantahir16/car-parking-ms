import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit{

  userType: string = 'consumer';
  stars: number[] = [1, 2, 3, 4, 5]; // Array to represent 5 stars
  selectedServiceRating: number = 0;
  selectedHygieneRating: number = 0;
  selectedSafteyRating: number = 0;
    
  constructor(private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((p: any) => {
      this.userType = p.userType; 
    });
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
