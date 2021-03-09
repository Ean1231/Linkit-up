import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ap-score',
  templateUrl: './ap-score.page.html',
  styleUrls: ['./ap-score.page.scss'],
})
export class ApScorePage implements OnInit {

  data:any

  perc;
  perc1;
  perc2;
  perc3;
  perc4;
  perc5;
  perc6;

  radioSelected:any;

  aps:any = 0;
   

  marks: any [] = [
    {
      id: 'Code 7 (A): ', name: "80 - 100%"
    },
    {
      id: 'Code 6 (A): ', name: "70 - 79%"
    },
    {
      id: 'Code 5 (A): ', name: "60 - 69%"
    },
    {
      id: 'Code 4 (A): ', name: "50 - 59%"
    },
    {
      id: 'Code 3 (A): ', name: "40 - 49%"
    },
    {
      id: 'Code 2 (A): ', name: "30 - 39%"
    },
    {
      id: 'Code 1 (A): ', name: "0 - 29%"
    }
  ]
  
  subList: any[] = [
    {
      id: 1, title: "Afrikaans"
    },
    {
      id: 2, title: "English"
    },
    {
      id: 3, title: "Indebele"
    },
    {
      id: 4, title: "Northern Sesotho"
    },
    {
      id: 5, title: "Southern Sesotho"
    },
    {
      id: 6, title: "Swazi"
    },
    {
      id: 7, title: "Tsonga"
    },
    {
      id: 8, title: "seTswana"
    },
    {
      id: 9, title: "Venda"
    },
    {
      id: 10, title: "isiXhosa"
    },
    {
      id: 11, title: "isiZulu"
    },
    {
      id: 12, title: "Mathematics"
    },
    {
      id: 13, title: "Mathematical Literacy"
    },
    {
      id: 14, title: "Technical Mathematics"
    },
    {
      id: 15, title: "Life Orientation"
    },
    {
      id: 16, title: "Accounting"
    },
    {
      id: 17, title: "Agricultural Management Practices"
    },
    {
      id: 18, title: "Agricultural Sciences"
    },
    {
      id: 19, title: "Agricultural Technology"
    },
    {
      id: 20, title: "Business Studies"
    },
    {
      id: 21, title: "Civil Technology"
    },
    {
      id: 22, title: "Computer Applications Technology"
    },
    {
      id: 23, title: "Consumer Studies"
    },
    {
      id: 24, title: "Dance Studies"
    },
    {
      id: 25, title: "Design"
    },
    {
      id: 26, title: "Dramatic Arts"
    },
    {
      id: 27, title: "Economics"
    },
    {
      id: 28, title: "Electrical Technology"
    },
    {
      id: 29, title: "Engineering Graphics & Design"
    },
    {
      id: 30, title: "Geography"
    },
    {
      id: 31, title: "History"
    },
    {
      id: 32, title: "Hospitality Studies"
    },
    {
      id: 33, title: "Information Technology"
    },
    {
      id: 34, title: "Life Sciences"
    },
    {
      id: 35, title: "Mechanical Technology"
    },
    {
      id: 36, title: "Music"
    },
    {
      id: 37, title: "Physical Science"
    },
    {
      id: 38, title: "Religion Studies"
    },
    {
      id: 39, title: "Second Additional Language"
    },
    {
      id: 40, title: "Third Additional Language"
    },
    {
      id: 41, title: "Tourism"
    },
    {
      id: 42, title: "Visual Arts"
    }

  ];

  constructor(public router: Router)
    {
      this.aps =this.router.getCurrentNavigation().extras.state
       
    }
  

  
  
  ngOnInit() {
    this.data =this.router.getCurrentNavigation().extras.state;
     console.log(this.data)
  }

}
