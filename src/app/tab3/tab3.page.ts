import { Component } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
import { ServiceService } from '../service.service';
import { LoadingController } from "@ionic/angular";
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
import { ToastController } from '@ionic/angular'
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  opportunities = [] ;
  showContent:boolean =true;
  readMoreContent:boolean =false;


  constructor(private firestore: AngularFirestore,private service: ServiceService,  public load: LoadingController, private alertController: ToastController)
 {
  this.presentLoadingWithOptions();
  this.service.getOpportunities().then((items:any)=>{
    console.log(items);
     this.opportunities = items;
  })
   
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

showMore(){
  this.showContent =false;
  this.readMoreContent =true;
}


async share(){
  let shareRet = await Share.share({
    title: 'See cool stuff',
    text: 'Really awesome thing you need to see right meow',
    url: 'http://ionicframework.com/',
    dialogTitle: 'Share with buddies'
  });
   
}


filterData(ev: any) {
  
  const val = ev.target.value;
  if (val && val.trim() != "") {
    this.opportunities = this.opportunities.filter((item) => {
      
      return item.type.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
}

  

}
