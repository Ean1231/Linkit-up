import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-all-opportunities',
  templateUrl: './all-opportunities.page.html',
  styleUrls: ['./all-opportunities.page.scss'],
})
export class AllOpportunitiesPage implements OnInit {
  opportunities = [] ;
data: any;
  constructor(public service: ServiceService, public router: Router) { 
    this.service.getOpportunities().then((items:any)=>{
      console.log(items);
       this.opportunities = items;
    });
  }

  ngOnInit() {
  }

}
