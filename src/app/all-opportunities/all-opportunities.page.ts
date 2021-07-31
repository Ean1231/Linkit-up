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
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
  
   
  }
  
  details(data){
    console.log(data)
    this.router.navigateByUrl('/opportunity-details', {state:data});
  }


  filterData(ev: any) {
  
    const val = ev.target.value;
    if (val && val.trim() != "") {
      this.opportunities = this.opportunities.filter((item) => {
        
        return item.type.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
      
    }
  }

}
