import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  email;
  password;

  constructor( public auth: AngularFireAuth, public router: Router)
  {

  }

  Login()
  {
    this.auth.auth.signInWithEmailAndPassword(this.email, this.password).then(() =>
    {
      this.router.navigateByUrl('/tab3')
    }).catch((error) =>
    {
      console.log(error.message)
    })
  }

  
  ngOnInit() {
  }

}
