import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../service.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.page.html',
  styleUrls: ['./institutions.page.scss'],
})
export class InstitutionsPage implements OnInit {

  varsities = [];
  data:any;

  constructor( public service: ServiceService, public router: Router) { 

    this.service.getVarsities().then((items:any)=>{
      console.log(items);
      this.varsities = items;

    });
  }
  

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)

}
details(data){
  console.log(data)
  this.router.navigateByUrl('/details', {state:data});
}

}
