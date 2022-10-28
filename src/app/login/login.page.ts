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

  

  // login(){
  //   this.auth.Login(this.email ,this.password).then(()=>{
  //       this.router.navigateByUrl('/tabs/tabs/tab3')
  //   }).catch((error)=>{
  //     this.presentAlert(error.message);
  //    }) 
  // }

  login(email, password) { 
    this.auth.SignIn(email.value, password.value)
      .then(() => {
        // console.log(email)
        this.router.navigate(['/tabs/tabs/tab3']);  
      }).catch((error) => {
       console.log(error.message)
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

function ev(ev: any) {
  throw new Error('Function not implemented.');

}

