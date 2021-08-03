import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router'
import { IonSearchbar } from '@ionic/angular';
@Component({
  selector: 'app-all-opportunities',
  templateUrl: './all-opportunities.page.html',
  styleUrls: ['./all-opportunities.page.scss'],
})
export class AllOpportunitiesPage implements OnInit {
  @ViewChild('search', {static: false}) search: IonSearchbar;
  opportunities = [] ;
data: any;
  constructor(public service: ServiceService, public router: Router) { 
    this.service.getOpportunities().then((items:any)=>{
      console.log(items);
       this.opportunities = items;
    });
  }

ionViewDidEnter(){
  setTimeout(() => {
    this.search.setFocus()
  }, );
}

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
  
   
  }
  
  details(data){
    console.log(data)
    this.router.navigateByUrl('/opportunity-details', {state:data});
  }


  _ionChange(event) {
  
    const val = event.target.value;
    if (val && val.trim() != "") {
      this.opportunities = this.opportunities.filter((item: any) => {
        
        return (item.type.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      
    }
  }

}
