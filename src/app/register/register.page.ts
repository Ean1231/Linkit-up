import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';

import { AuthService} from "../auth.service"


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  loading: boolean = false;
  showmessage
  name
  surname
  email
  confirmPassword
  Date
  password
  signupForm: FormGroup;
  showPassword: boolean = false;
  
  constructor(
    public router: Router, 
    public auth:AuthService, 
    private firestore: AngularFirestore, 
    public alertController: AlertController,
    private location: Location
  ){ }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'surname': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  signup(){
    this.loading = true;
    
    // Add join date to the form value
    const signupData = {
      ...this.signupForm.value,
      joinedDate: new Date().toISOString()
    };
    
    this.auth.Register(signupData)
    .then((result) => {
      this.loading = false;
      if (result == null)  
      this.goBack();
      this.goToLogin();
    }).catch((error) => {
      window.alert(error.message);
    })
  }


  SignUp(email, password, name, surname){
    let id = this.firestore.createId();
    this.firestore.collection('users').doc(id).set({
      name: name,
      surname: surname,
      email: email,
      password: password,
      joinedDate: new Date().toISOString()
    }).then(()=>{
      this.auth.SignUp(email, password)
      this.presentAlert('Congratulations!! Now Sign in with email and password')
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
         this.goBack()
        }
      
      }]
    });
  
    await alert.present();
   
  }
  

  goBack() {
    this.location.back();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
