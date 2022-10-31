import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AuthService} from "../auth.service"
import { LoginPage } from '../login/login.page';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  loading: boolean;
  showmessage
  name
  surname
  email
  confirmPassword
  Date
  password
  signupForm: FormGroup;
  constructor(public router: Router, public auth:AuthService, private firestore: AngularFirestore, public alertController: AlertController, public modalCtrl: ModalController,
  ){ }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'surname': new FormControl('', Validators.required),
      'email': new FormControl(),
      'password': new FormControl('', Validators.required),
  });
  }


  signup(){
    this.loading = true;
    this.auth.Register(this.signupForm.value)
    .then((result) => {
      this.loading = false;
      if (result == null)  
      this.dismiss();
      this.login();
    }).catch((error) => {
      window.alert(error.message);
    })
    // this.sendEmail(this.email, this.displayName);
}


  SignUp(email, password, name, surname){
    let id = this.firestore.createId();
    this.firestore.collection('users').doc(id).set({
    name: name,
    surname: surname,
    email: email,
    password:password,

    
    }).then(()=>{
    this.auth.SignUp(email, password, )
    this.presentAlert('Congradulations!!  Now Sign in with email  and password')
    setTimeout(()=> this.showmessage = false, 3000);
    this.name = '';
    this.surname = '';
    this.email = '';
    this.Date = '';
    this.router.navigateByUrl('')      
    }).catch((error)=>{
      this.presentAlert(error.message)
      
    })
  }
  
  
  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Attention User',
      message:message,
      buttons: [{
        text:'OK',
        handler: () => {
         this.dismiss()
        }
      
      }]
    });
  
    await alert.present();
   
  }
  

  async dismiss() {
    return await this.modalCtrl.dismiss();
  }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      animated: true,
      mode: 'ios',
      backdropDismiss: false,
      cssClass: 'register-modal',
    })

    return await modal.present();
  }

}
