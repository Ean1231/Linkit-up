import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

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

 constructor( public router: Router, public auth:AuthService, private firestore: AngularFirestore)
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
  this.showmessage = true
  setTimeout(()=> this.showmessage = false, 3000);
  this.name = '';
  this.surname = '';
  this.email = '';
  this.router.navigateByUrl('/tabs/tabs/tab3')
  }).catch((error)=>{
    alert(error)
    
  })
}
 
 
 
 



}







