import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

import { AuthService} from "../auth.service"


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit{
  showmessage
  name
  surname
  email
  confirmPassword

 constructor( public router: Router, public auth:AuthService, private firestore: AngularFirestore, public alertController: AlertController)
  {

  }
  
 
  
ngOnInit()
{
    
}



SignUp(email, password, name, surname, confirmPassword){
  let id = this.firestore.createId();
  this.firestore.collection('users').doc(id).set({
  name: name,
  surname: surname,
  email: email,
  password:password,
  confirmPassword:confirmPassword
  
  }).then(()=>{
  this.auth.SignUp(email, password, )
  this.presentAlert('Congradulations!!  Now Sign in with email  and password')
  setTimeout(()=> this.showmessage = false, 3000);
  this.name = '';
  this.surname = '';
  this.email = '';
  this.router.navigateByUrl('')      
  }).catch((error)=>{
    this.presentAlert(error.message)
    
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







