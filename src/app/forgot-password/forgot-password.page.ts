import { Component} from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ServiceService } from '../service.service';
import { AuthService} from "../auth.service"

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage  {

  constructor(private auth:  AuthService ,  public load: LoadingController )
  {
  
  }


  forgotPassword(){
    this.auth.forgotPassword("kabelo@mlab.co.za").then(()=>{
      console.log("Check your email , to  confirm")

    })

  }
  
  
}

