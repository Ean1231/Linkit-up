import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import  { AuthService} from "../auth.service"
import { Router } from '@angular/router'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
email:any;
password ;
  constructor(
    public modalCtrl: ModalController,
    public auth: AuthService,
    public router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  

  login(){
    this.auth.Login(this.email ,this.password).then(()=>{
        this.router.navigateByUrl('/tabs/tabs/tab3')

    }).catch((error)=>{
      this.presentAlert(error.message);
       
     }) 
  }
  

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Attention User',
      message:message,
      buttons: ['OK']
    });

    await alert.present();
    
  }


  
  
}
