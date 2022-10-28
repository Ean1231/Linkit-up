import { Component, OnInit } from '@angular/core';
// import { Aps } from './aps';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
// import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import {ServiceService} from '../service.service';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ap-search',
  templateUrl: './ap-search.page.html',
  styleUrls: ['./ap-search.page.scss'],
})
export class ApSearchPage implements OnInit {
  aps;
  location;
  field;
  varsities = [] ;
  modalCtrl: any;
  data: any;

  constructor(public router: Router, public service :ServiceService,
    public load: LoadingController, public alertControllerr: AlertController)
  {
    this.presentLoadingWithOptions();
    this.service.getVarsities().then((items:any)=>{
      console.log(items);
      this.varsities = items;

    });
  }

  async presentAlert() {
    const alert = await this.alertControllerr.create({
      cssClass: 'my-custom-class',
      header: 'Attention User',
      subHeader: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [ {
        text: 'ok',
        handler: () => {
          this.router.navigateByUrl('/welcome')
        }
      },
      {
        text: 'Cancel',
        handler: () => {
          this.router.navigateByUrl('/ap-search')
        }
      }]
      
    });
  
    await alert.present();
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
    let location =  aps.filter(location =>location.location == this.location) ;
    let field =  location.filter(field =>field.qualification == this.field) ;
    this.router.navigateByUrl('/institutions', {state:field})
  }

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }


  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data, "The data")
  }

}
