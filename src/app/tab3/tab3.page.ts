import { Component } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import { ServiceService } from '../service.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  opportunities = []

  constructor(private firestore: AngularFirestore,private service: ServiceService)
 {

  this.service.getOpportunities().then((items:any)=>{
    console.log(items);
     this.opportunities = items;
  })
   
 }

 

  

}
