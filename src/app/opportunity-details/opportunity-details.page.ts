import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router' ;
import { ServiceService } from '../service.service'

@Component({
  selector: 'app-opportunity-details',
  templateUrl: './opportunity-details.page.html',
  styleUrls: ['./opportunity-details.page.scss'],
})
export class OpportunityDetailsPage implements OnInit {
  showdata:any;
  bursaries: any;
  constructor(public router :Router, public service: ServiceService) 
  {
    this.service.getBursaries().then((items:any)=>{
       console.log(items);
        this.bursaries = items;
     
     });
 
  }
   

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getOpportunities();
  }

}
