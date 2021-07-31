import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-all-bursarues',
  templateUrl: './all-bursarues.page.html',
  styleUrls: ['./all-bursarues.page.scss'],
})
export class AllBursaruesPage implements OnInit {
bursaries =[]
data: any;
  constructor(private service: ServiceService, public router: Router) {
    this.service.getBursaries().then((items:any)=>{
        console.log(items);
        this.bursaries = items;
     
     });
   }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
  }
  filterData(ev: any) {
  
    const val = ev.target.value;
    if (val && val.trim() != "") {
      this.bursaries = this.bursaries.filter((item) => {
        
        return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
      
    }
  }

  bursaryDetails(data){
    console.log(data)
    this.router.navigateByUrl('/bursaries', {state:data});
  }

}
