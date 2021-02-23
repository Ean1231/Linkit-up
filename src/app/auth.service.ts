import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth :AngularFireAuth) { }



  Login(email , password) {

    return new Promise((resolve, reject)=>{
      this.auth.signInWithEmailAndPassword(email, password).then(()=>{
        resolve('')

      }).catch((err)=>{
        reject(err)

      })
    })

  }


 
  SignUp(email , password){
    
    return new Promise((resolve, reject)=>{
      this.auth.createUserWithEmailAndPassword(email, password).then(()=>{
        resolve('')

      }).catch((err)=>{
        reject(err)

      })
    })
   
  }


  }


