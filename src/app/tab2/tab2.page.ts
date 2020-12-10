import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonInfiniteScroll, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  perc;
  perc1;
  perc2;
  perc3;
  perc4;
  perc5;
  perc6;

  radioSelected:any;

  sum = 0;


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


  constructor( private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar)
  {
    this.initializeApp();   


    
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  calculate(){

    

    //Perc
    if (this.perc.trim()== "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc.trim()== "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc.trim()== "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc.trim()==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc.trim()== "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc.trim()== "0 - 29%".trim())
    {
      this.sum += 1
    }


    //Perc1

    if (this.perc1.trim() == "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc1.trim() == "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc1.trim() == "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc1.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc1.trim() ==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc1.trim() == "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc1.trim() == "0 - 29%".trim())
    {
      this.sum += 1
    }



    //perc2


   if (this.perc2.trim() == "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc2.trim() == "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc2.trim() == "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc2.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc2.trim() ==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc2.trim() == "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc2.trim() == "0 - 29%".trim())
    {
      this.sum += 1
    }

    //perc3

    if (this.perc3.trim() == "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc3.trim() == "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc3.trim() == "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc3.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc3.trim() ==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc3.trim() == "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc3.trim() == "0 - 29%".trim())
    {
      this.sum += 1
    }

    //perc4

    if (this.perc4.trim() == "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc4.trim() == "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc4.trim() == "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc4.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc4.trim() ==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc4.trim() == "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc4.trim() == "0 - 29%".trim())
    {
      this.sum += 1
    }

    //perc5

    if (this.perc5.trim() == "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc5.trim() == "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc5.trim() == "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc5.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc5.trim() ==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc5.trim() == "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc5.trim() == "0 - 29%".trim())
    {
      this.sum += 1
    }

    //perc6

   if (this.perc6.trim() == "80 - 100%".trim())
    {
      this.sum += 7;
    }
    else if (this.perc6.trim() == "70 - 79%".trim())
    {
      this.sum += 6
    }
    else if (this.perc6.trim() == "60 - 69%".trim())
    {
      this.sum += 5
    }
    else if (this.perc6.trim() == "50 - 59%".trim())
    {
      this.sum += 4
    }
    else if (this.perc6.trim() ==  "40 - 49%".trim())
    {
      this.sum += 3
    }
    else if (this.perc6.trim() == "30 - 39%".trim())
    {
      this.sum += 2
    }
    else if (this.perc6.trim() == "0 - 29%".trim())
    {
      this.sum += 1
    }
   
    
  }
 
  
}
