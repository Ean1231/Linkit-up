import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import {Router} from '@angular/router' ;
import { ServiceService } from '../service.service'


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

showdata:any;
  constructor(public router :Router, public actionsheetcontroller: ActionSheetController, public service: ServiceService) { 



  }
  

  

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata)    
  }

  // data = [{
  //   name: "Sol plaaje university", 
  //   image: "../../assets/Student_Safety_SPU_210119-WI-PT.jpg",
  //   description: "The Sol Plaatje University, which had provisionally been referred to as the University of the Northern Cape, opened in Kimberley, South Africa, in 2014, accommodating a modest initial intake of 135 students. The student complement is expected to increase gradually towards a target of 7 500 students by 2024. Launched in a ceremony in Kimberley on 19 September 2013,[3] it had been formally established as a public university in terms of Section 20 of the Higher Education Act of 1997, by way of Government Notice 630, dated 22 August 2013.[4] Minister of Higher Education and Training, Blade Nzimande, observed at the launch that this “is the first new university (in South Africa) to be launched since 1994 and as such is a powerful symbol of the country’s democracy, inclusiveness, and growth. It represents a new order of African intellect, with a firm focus on innovation and excellence."    ,
  //   bursaries: "test",
  //   apply: "https://www.spu.ac.za/"
  // },{
  //   name: "Boston city campus", 
  //   image: "../../assets/Student_Safety_SPU_210119-WI-PT.jpg",
  //   description: "The Sol Plaatje University, which had provisionally been referred to as the University of the Northern Cape, opened in Kimberley, South Africa, in 2014, accommodating a modest initial intake of 135 students. The student complement is expected to increase gradually towards a target of 7 500 students by 2024. Launched in a ceremony in Kimberley on 19 September 2013,[3] it had been formally established as a public university in terms of Section 20 of the Higher Education Act of 1997, by way of Government Notice 630, dated 22 August 2013.[4] Minister of Higher Education and Training, Blade Nzimande, observed at the launch that this “is the first new university (in South Africa) to be launched since 1994 and as such is a powerful symbol of the country’s democracy, inclusiveness, and growth. It represents a new order of African intellect, with a firm focus on innovation and excellence."    ,
  //   bursaries: "test",
  //   apply: "https://www.spu.ac.za/"

  // },{
  //   name: "Boston city campus", 
  //   image: "../../assets/Student_Safety_SPU_210119-WI-PT.jpg",
  //   description: "The Sol Plaatje University, which had provisionally been referred to as the University of the Northern Cape, opened in Kimberley, South Africa, in 2014, accommodating a modest initial intake of 135 students. The student complement is expected to increase gradually towards a target of 7 500 students by 2024. Launched in a ceremony in Kimberley on 19 September 2013,[3] it had been formally established as a public university in terms of Section 20 of the Higher Education Act of 1997, by way of Government Notice 630, dated 22 August 2013.[4] Minister of Higher Education and Training, Blade Nzimande, observed at the launch that this “is the first new university (in South Africa) to be launched since 1994 and as such is a powerful symbol of the country’s democracy, inclusiveness, and growth. It represents a new order of African intellect, with a firm focus on innovation and excellence."    ,
  //   bursaries: "test",
  //   apply: "https://www.spu.ac.za/"
  // }]


  // getImage(name: string): string {
  //   return this.data.find(d => d.name === name).image;
  // }

  // getDescription(name: string): string {
  //   return this.data.find(d => d.name === name).description;
  // }

  // bursaries(){
  //   console.log(this.showdata.bursaries);
  //   this.router.navigateByUrl("/bursaries" , {state: this.data} );
  //   }

 


 

  //showContact(){
    //this.presentActionSheet() ;
  //}

  //bursaries(){
    //console.log(this.showdata.bursaries);
    //this.router.navigateByUrl("/bursaries" , {state:this.showdata.bursaries} );
    //}


  async presentActionSheet() {
    const actionSheet = await this.actionsheetcontroller.create({
      header: 'Contact Details',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Phone',
        role: 'destructive',
        icon: 'call',
        handler: () => {
          console.log('Phone clicked');

          //CALL LOG

          // this.callnumber.callNumber("0719037911", true)
        //  .then(res => console.log('Launched dialer!', res))
        //  .catch(err => console.log('Error launching dialer', err));
        }
      }, {
        text: 'Email',
        icon: 'mail',
        handler: () => {
          console.log('Email clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
