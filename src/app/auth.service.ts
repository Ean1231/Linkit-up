import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

export interface User {
  // uid: any;
  name: any;
  surname: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 password: any;
  userData: any;

  constructor(public auth :AngularFireAuth, public afStore: AngularFirestore) { 
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      // uid: user.uid,
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,

    };
    return userRef.set(userData, {
      merge: true,
    });
    
  }

  Login(email , password) {
    return new Promise((resolve, reject)=>{
      this.auth.signInWithEmailAndPassword(email, password).then(()=>{
        resolve('')
      }).catch((err)=>{
        reject(err)
      })
    })

  }

  Register(user: any) :Promise<any>{

    return this.auth.createUserWithEmailAndPassword(user.email, user.password).then((result)=>{
        let emailLower = user.email.toLowerCase();
        this.afStore.doc('/users/' + emailLower)
        .set({
              name: user.name,
              surname: user.surname,
              email: user.email,
              password: user.password,
        });
        // result.user.sendEmailVerification();
        // this.SendVerificationMail();
        
    }).catch(error => {
      console.log('Auth Service: signup error', error);
  });
  }
 
  SignUp(email, password){
    return new Promise((resolve, reject)=>{
      this.auth.createUserWithEmailAndPassword(email, password).then(()=>{
        resolve('Success')
      }).catch((err)=>{
        reject(err)
      })
    })
  }

  SignIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  forgotPassword(email)
  {

    return new Promise((resolve , reject)=>{
      this.auth.sendPasswordResetEmail(email).then(()=>{
        resolve("Success")


      }).catch((err)=>{
        reject(err)
      })

    })
    
    
  }

  
  

 

  }


