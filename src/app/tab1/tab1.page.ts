import { Component, OnInit } from '@angular/core';
// import { Aps } from './aps';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
// import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import {ServiceService} from '../service.service';

import { ModalController } from '@ionic/angular';




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
  modalCtrl: any;

  constructor(public router: Router, public service :ServiceService,
    public load: LoadingController)
  {
    this.presentLoadingWithOptions();
    this.service.getVarsities().then((items:any)=>{
      console.log(items);
      this.varsities = items;

    });
    
    

   
  }

  ionViewWillEnter() {
   
  }

  ngOnInit() {
   
  
  }


  async presentLoadingWithOptions() {
    const loading = await this.load.create({
      spinner: "circles",
      duration: 1000,
      message: "Please wait",
      translucent: true,
      cssClass: "custom-class custom-loading",
      backdropDismiss: true,
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed with role:", role);
  }


submit (ap){
  
  let aps = this.varsities.filter(aps => aps.aps == ap);
  console.log(aps);
  let location =  aps.filter(location =>location.location == this.location) ;
  console.log(this.field)
  let field =  location.filter(field =>field.qualification == this.field) ;
  console.log(field)
 console.log(location)
  this.router.navigateByUrl('/institutions', {state:field})
}


async dismiss() {
  return await this.modalCtrl.dismiss();
}

}
function ngOnInit() {
  throw new Error('Function not implemented.');
}

