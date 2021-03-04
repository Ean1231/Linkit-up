import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import {Router} from '@angular/router' ;
import { ServiceService } from '../service.service'


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

showdata:any;
  constructor(public router :Router, public actionsheetcontroller: ActionSheetController, public service: ServiceService) { 

  }
  

  

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getVarsities() 
  }




  async presentActionSheet() {
    const actionSheet = await this.actionsheetcontroller.create({
      header: 'Contact Details',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Phone',
        role: 'destructive',
        icon: 'call',
        handler: () => {
          console.log('Phone clicked');

          //CALL LOG

          // this.callnumber.callNumber("0719037911", true)
        //  .then(res => console.log('Launched dialer!', res))
        //  .catch(err => console.log('Error launching dialer', err));
        }
      }, {
        text: 'Email',
        icon: 'mail',
        handler: () => {
          console.log('Email clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
