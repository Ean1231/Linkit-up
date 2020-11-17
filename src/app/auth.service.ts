import { Injectable } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth' ;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth :AngularFireAuth) { }



  Login(email , password) {

    return new Promise ((resolve, reject)=>{

      this.auth.auth.signInWithEmailAndPassword(email, password).then(() => {
        resolve()
     
      }).catch((error) => {
      reject(error)
      })
    })
   
  }


 
  SignUp(email , password){
    
    return new Promise ((resolve, reject)=>{

      this.auth.auth.createUserWithEmailAndPassword(email, password).then(() => {
        resolve()
     
      }).catch((error) => {
      reject(error)
      })
    })
   
  }


  }


