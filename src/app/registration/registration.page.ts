import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService} from "../auth.service"


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage{

  log(x)
  {
    console.log(x);
  }

registrationForm = this.fromBuilder.group({
  name: ['', [Validators.required, Validators.maxLength(30)]],
  surname: ['', [Validators.required, Validators.maxLength(30)]],
  email: ['', [Validators.required, Validators.pattern]],
  password: ['', [Validators.required, Validators.pattern]],
  confirmPassword: ['', [Validators.required, Validators.pattern]]
})


 constructor( private fromBuilder: FormBuilder, public router: Router, public auth:AuthService)
  {

  }
  
  public submit()
  {
    console.log(this.registrationForm.value);
  }
  
ngOnInit()
{
    
}



  get name()
  {
    return this.registrationForm.get('');
  }


  
  get surname()
  {
    return this.registrationForm.get('');
  }

  
  get email()
  {
    return this.registrationForm.get('');
  }

  
  get password()
  {
    return this.registrationForm.get('');
  }

  
  get confirmPassword()
  {
    return this.registrationForm.get('');
  }


  public errorMessage = {
    name: [
      { type: 'required', message: 'Name is required'},
      { type: 'maxlength', message: 'Name cannot be longer than 100 characters'}
    ],

    surname: [
      { type: 'required', message: 'Surname is required'},
      { type: 'maxlength', message: 'Surname cannot be longer than 100 characters'}
    ],

    email: [
      { type: 'required', message: 'Email is required'},
      { type: 'pattern("/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/")', message: 'Please enter a valid email address'}
    ],

    password: [
      { type: 'required', message: 'Password is required'},
      { type: 'pattern', message: 'Please enter a valid password'}
    ],

    confirmPassword: [
      { type: 'required', message: 'Confirm password is required'},
      { type: 'pattern', message: 'Make sure that this password matches the one on top'}
    ],
  }

 
 
 



}
