import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-accomodation-details',
  templateUrl: './accomodation-details.page.html',
  styleUrls: ['./accomodation-details.page.scss'],
})
export class AccomodationDetailsPage implements OnInit {
  showdata: any;
  constructor(public roter: Router, public service: ServiceService) { }

  ngOnInit() {
    this.showdata = this.roter.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getAccomodation();
  }

  

}
