import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService} from "../auth.service";

import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  
  email;
  password;




  userEmail = new FormGroup({
    email: new FormControl('',[Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),

    password: new FormControl('', [Validators.required])
  });

  constructor( private FormBuilder: FormBuilder, public router: Router, public auth:AuthService)
  {

  }

  public submit()
  {
    console.log(this.loginForm.value);
  }

  get Email()
  {
    return this.loginForm.get('email')
  }

  get Password()
  {
    return this.loginForm.get('password')
  }

  public errorMessages = {
    email: [
      {type: 'required', message: 'Email is required'},
      {type: 'pattern', message: 'Please eneter a valid email address'}
    ],

    password: [
      {type: 'required', message: 'Password is required'},
      {type: 'length', message: 'Please enter password'}
    ]
  }
 
  loginForm = this.FormBuilder.group({
    email: ['', [Validators.required, Validators.pattern]],
    password: ['', [Validators.required, Validators.length]]
  })
  
  login(){
    this.auth.Login(this.email , this.password).then(()=>{
   
    }).catch((error)=>{
      console.log(error.message)
    })
  }

  signup(){
    this.router.navigateByUrl('/sign-up');
  }


  
  
}
