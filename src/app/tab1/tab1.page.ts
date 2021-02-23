import { Component } from '@angular/core';
// import { Aps } from './aps';
import { Router } from '@angular/router';
// import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import {ServiceService} from '../service.service';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  aps;
  location;
  field;

  
varsities = [] ;
  constructor(public router: Router, public service :ServiceService)
  {
    this.service.getVarsities().then((items:any)=>{
      console.log(items);
      this.varsities = items;

    });

  }


submit (){
  
  let aps = this.varsities.filter(aps => aps.aps == this.aps);
  console.log(aps);
  let location =  aps.filter(location =>location.location == this.location) ;
  let field =  location.filter(field =>field.qualification == this.field) ;
  console.log(location)
  this.router.navigateByUrl('/institutions', {state: field})
}

}
