import { Component, OnInit } from '@angular/core';
// import { Aps } from './aps';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
// import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import {ServiceService} from '../service.service';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  aps;
  location;
  field;
  accomodation;
  data: any;
  loading: boolean;
  varsities = [] ;
  modalCtrl: any;

  constructor(public router: Router, public service :ServiceService, public load: LoadingController, public alertControllerr: AlertController)
  {
    this.loading = true;
    this.service.getVarsities().then((items:any)=>{
     this.loading = false
      console.log(items);
      this.varsities = items;
    });
    this.service.getAccomodation().then((items:any)=>{
      console.log(items);
      this.accomodation = items;

    });
    
    

   
  }

  details(data){
    console.log(data)
    this.router.navigateByUrl('/accomodation-details', {state:data});
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
          this.router.navigateByUrl('/tabs/tabs/tab1')
        }
      }]
      
    });
  
    await alert.present();
  }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
  
  }

  // Date checking methods for accommodations
  isAccommodationClosed(accommodation: any): boolean {
    if (!accommodation.closingDate && !accommodation.availableUntil) return false;
    
    const currentDate = new Date();
    const closingDate = this.parseClosingDate(accommodation.closingDate || accommodation.availableUntil);
    
    return closingDate < currentDate;
  }

  parseClosingDate(dateString: string): Date {
    if (!dateString) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now
    
    // Handle various date formats
    const cleanDate = dateString.replace(/[^\d\/\-\s]/g, '');
    
    // Try different date formats
    const formats = [
      () => new Date(dateString), // ISO format
      () => new Date(cleanDate), // Clean format
      () => {
        const parts = cleanDate.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      },
      () => {
        const parts = cleanDate.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return null;
      }
    ];
    
    for (const format of formats) {
      try {
        const date = format();
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        continue;
      }
    }
    
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now
  }

  formatClosingDate(dateString: string): string {
    if (!dateString) return 'Available';
    
    const closingDate = this.parseClosingDate(dateString);
    const currentDate = new Date();
    const timeDiff = closingDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return 'CLOSED';
    } else if (daysDiff === 0) {
      return 'Today';
    } else if (daysDiff === 1) {
      return 'Tomorrow';
    } else if (daysDiff <= 7) {
      return `${daysDiff} days left`;
    } else {
      return 'Available';
    }
  }

  getDateChipColor(accommodation: any): string {
    if (this.isAccommodationClosed(accommodation)) {
      return 'danger';
    }
    
    if (!accommodation.closingDate && !accommodation.availableUntil) {
      return 'success';
    }
    
    const closingDate = this.parseClosingDate(accommodation.closingDate || accommodation.availableUntil);
    const currentDate = new Date();
    const timeDiff = closingDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 3) {
      return 'warning';
    } else if (daysDiff <= 7) {
      return 'tertiary';
    } else {
      return 'success';
    }
  }

  async share(){
    let shareRet = await Share.share({
      title: 'Share with friends',
      text: 'Let others know about available places',
      url: '', //http://ionicframework.com/
      dialogTitle: 'Share with buddies'
    });
     
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

  filterData(ev: any) {
  
    const val = ev.target.value;
    if (val && val.trim() != "") {
      this.accomodation = this.accomodation.filter((item) => {
        
        return item.location.toLowerCase().indexOf(val.toLowerCase()) > -1;
      })
      
    }
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

