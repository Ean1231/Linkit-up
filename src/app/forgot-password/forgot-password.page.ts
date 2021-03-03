import { Component} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage  {

  constructor(private service: ServiceService,  public load: LoadingController )
  {
  //   this.presentLoadingWithOptions();
  // this.service.getOpportunities().then((items:any)=>{
  //   console.log(items);
  //    this.load = items;
  // }

  }


// async presentLoadingWithOptions() {
//  const loading = await this.load.create({
//    spinner: "circles",
//    duration: 1000,
//    message: "Please wait",
//    translucent: true,
//    cssClass: "custom-class custom-loading",
//    backdropDismiss: true,
//  });
//  await loading.present();

//  const { role, data } = await loading.onDidDismiss();
//  console.log("Loading dismissed with role:", role);
// }

  
  // ngOnInit() {
  // }

}

