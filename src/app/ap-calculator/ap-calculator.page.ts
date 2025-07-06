import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonInfiniteScroll, LoadingController, Platform } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-ap-calculator',
  templateUrl: './ap-calculator.page.html',
  styleUrls: ['./ap-calculator.page.scss'],
})
export class ApCalculatorPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  perc;
  perc1;
  perc2;
  perc3;
  perc4;
  perc5;
  perc6;

  radioSelected:any;

  sum: any = undefined;
  isCalculating: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen, 
    public router: Router,
    public load: LoadingController,
    public alertController: AlertController,
    private toastController: ToastController
  ) {
    this.initializeApp();   
  }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention User',
      subHeader: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [ {
        text: 'ok',
        handler: () => {
          this.router.navigateByUrl('/welcome')
        }
      },
      {
        text: 'Cancel',
        handler: () => {
          this.router.navigateByUrl('/ap-calculator')
        }
      }]
    });
    await alert.present();
  }

  async presentAlertMultipleButtons(APS, message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'AP SCORE',
      subHeader: APS,
      message: message,
      buttons: [ {
        text: 'Search Universities',
        handler: () => {
          this.router.navigateByUrl('/ap-search', {state: {sum: this.sum}})
        }
      },
      {
        text: 'OK',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

  // Helper method to convert percentage to points
  private getPointsFromPercentage(percentage: string): number {
    if (!percentage) return 0;
    
    switch(percentage) {
      case "80 - 100%": return 7;
      case "70 - 79%": return 6;
      case "60 - 69%": return 5;
      case "50 - 59%": return 4;
      case "40 - 49%": return 3;
      case "30 - 39%": return 2;
      case "0 - 29%": return 1;
      default: return 0;
    }
  }

  // Validation method
  private validateInputs(): boolean {
    const requiredFields = [this.perc, this.perc1, this.perc2];
    const missingFields = requiredFields.filter(field => !field);
    
    if (missingFields.length > 0) {
      this.showToast('Please fill in at least the first 3 compulsory subjects', 'warning');
      return false;
    }
    
    return true;
  }

  // Show toast message
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  // Improved calculate method
  async calculate(sum) {
    if (!this.validateInputs()) {
      return;
    }

    this.isCalculating = true;
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset sum
    this.sum = 0;

    // Calculate points for each subject
    const subjects = [this.perc, this.perc1, this.perc2, this.perc3, this.perc4, this.perc5, this.perc6];
    
    subjects.forEach(subject => {
      this.sum += this.getPointsFromPercentage(subject);
    });

    this.isCalculating = false;

    // Show success message
    this.showToast(`Your AP Score is ${this.sum}`, 'success');

    // Also show the detailed alert
    setTimeout(() => {
      this.presentAlertMultipleButtons(
        `Your AP Score: ${this.sum}`,
        'Would you like to see which universities you qualify for?'
      );
    }, 1000);
  }

  // Reset form
  resetForm() {
    this.perc = undefined;
    this.perc1 = undefined;
    this.perc2 = undefined;
    this.perc3 = undefined;
    this.perc4 = undefined;
    this.perc5 = undefined;
    this.perc6 = undefined;
    this.sum = undefined;
    this.showToast('Form reset successfully', 'medium');
  }

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
      id: 35, title: "Mathematical Literacy"
    },
    {
      id: 36, title: "Music"
    },
    {
      id: 37, title: "Physical Sciences"
    },
    {
      id: 38, title: "Religion Studies"
    },
    {
      id: 39, title: "Technical Sciences"
    },
    {
      id: 40, title: "Tourism"
    },
    {
      id: 41, title: "Visual Arts"
    }
  ]

  async presentLoadingWithOptions() {
    const loading = await this.load.create({
      spinner: null,
      duration: 5000,
      message: 'Loading...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
}


