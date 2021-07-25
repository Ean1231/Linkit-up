import { Injectable } from '@angular/core';


import { AngularFirestore} from '@angular/fire/firestore';
import { RegistrationPage } from './registration/registration.page';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
listUniversities = [];
listopportuniites = [];
listbursaries = [];

  constructor( public firestore:AngularFirestore) { 

  
  }



  getVarsities(){

    return new Promise((res, rej)=>{
      this.firestore.collection('Add').valueChanges().subscribe((items: any) => {
        this.listUniversities = items;
        //console.log(items)
        res(this.listUniversities) ;
        })

    })   

  }
  

  getOpportunities(){
    return new Promise((res, rej)=>{
      this.firestore.collection('timeline').valueChanges().subscribe((items: any) => {
        this.listopportuniites = items;
        //console.log(items)
        res(this.listopportuniites) ;
        })
    })
  }


  getBursaries(){
    return new Promise((res, rej)=>{
      this.firestore.collection('bursaries').valueChanges().subscribe((items: any) => {
        this.listbursaries = items;
        //console.log(items)
        res(this.listbursaries) ;
        })
    })
  }
  
}
