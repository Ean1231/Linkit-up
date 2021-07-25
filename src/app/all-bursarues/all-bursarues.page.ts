import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-all-bursarues',
  templateUrl: './all-bursarues.page.html',
  styleUrls: ['./all-bursarues.page.scss'],
})
export class AllBursaruesPage implements OnInit {
bursaries =[]
  constructor(private service: ServiceService) {
    this.service.getBursaries().then((items:any)=>{
        console.log(items);
        this.bursaries = items;
     
     });
   }

  ngOnInit() {
  }

}
