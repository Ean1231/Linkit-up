import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService} from "../auth.service"

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  email;
  password;


  constructor(  public router: Router, public auth:AuthService)
  {

  }


  ngOnInit() {

  }


  login(){
    this.auth.Login(this.email, this.password).then(()=>{
     this.router.navigateByUrl('/tabs/tabs/tab3')

    }).catch((error)=>{
      alert(error)
      
    }) 
    
  }

}
