import { Component } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private firestore: AngularFirestore)
 {
   
 }

  

}
