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

  constructor(private firestore: AngularFirestore,private service: ServiceService)
 {

  service.getOpportunities().then((res)=>{
    console.log(res)
  })
   
 }

  

}
