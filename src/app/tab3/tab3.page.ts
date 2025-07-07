import { Component } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ServiceService } from '../service.service';
import { LoadingController } from "@ionic/angular";
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import  { AuthService} from "../auth.service"
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  opportunities = [] ;
  bursaries = [];
  showContent:boolean =true;
  readMoreContent:boolean =false;
  data:any;
  datta:any;
  loading: any;
  search: string;
  user: Observable<any>;
  notifications: any[] = [];
  notificationCount: number = 0;

  // Date filtering properties
  dateFilter: any = null;
  customDateFrom: string = '';
  customDateTo: string = '';
  
  // Bursary date filtering properties
  bursaryDateFilter: any = null;
  customBursaryDateFrom: string = '';
  customBursaryDateTo: string = '';

  constructor( private alertController: AlertController,private authService: AuthService ,public router: Router, public firestore: AngularFirestore,public service: ServiceService,  public load: LoadingController, private toastController: ToastController, public alertControllerr: AlertController, public auth: AngularFireAuth, private notificationService: NotificationService, private actionSheetController: ActionSheetController)
 {
  this.loading = true;
  this.service.getOpportunities().then((items:any)=>{
   this.loading = false;
    console.log(items);
     this.opportunities = items;
    //  this.loading = false;
  });

  this.service.getBursaries().then((items:any)=>{
    this.loading = false;
     this.bursaries = items;
    //  this.loading = false;
  });
 }

 ngOnInit() {
  this.data = this.router.getCurrentNavigation().extras.state;
  console.log(this.data)

  //for current username to display
  this.auth.authState.subscribe((user) => {
    if (user) {
      let emailLower = user.email.toLowerCase();
      this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
    } else {
   console.log("error")
    }
  });

  // Listen for notifications
  this.notificationService.currentMessage.subscribe((message) => {
    if (message) {
      this.handleNotification(message);
    }
  });

  // Load stored notifications
  this.loadStoredNotifications();
}

details(data){
  console.log(data)
  this.router.navigateByUrl('/opportunity-details', {state:data});
}

handleNotification(message: any) {
  console.log('Notification received in Tab3:', message);
  
  // Add notification to local array
  this.notifications.unshift({
    id: Date.now(),
    title: message.notification?.title || 'New Notification',
    body: message.notification?.body || 'You have a new notification',
    data: message.data || {},
    timestamp: new Date(),
    read: false
  });
  
  // Update notification count
  this.notificationCount = this.notifications.filter(n => !n.read).length;
  
  // Store notifications in localStorage for persistence
  localStorage.setItem('notifications', JSON.stringify(this.notifications));
}

loadStoredNotifications() {
  const stored = localStorage.getItem('notifications');
  if (stored) {
    this.notifications = JSON.parse(stored);
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }
}

markNotificationAsRead(notificationId: number) {
  const notification = this.notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    this.notificationCount = this.notifications.filter(n => !n.read).length;
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }
}

markAllNotificationsAsRead() {
  this.notifications.forEach(n => n.read = true);
  this.notificationCount = 0;
  localStorage.setItem('notifications', JSON.stringify(this.notifications));
}

clearAllNotifications() {
  this.notifications = [];
  this.notificationCount = 0;
  localStorage.removeItem('notifications');
}

async viewNotifications() {
  const alert = await this.alertControllerr.create({
    header: 'Notifications',
    message: this.notifications.length > 0 ? 
      this.notifications.map(n => `<strong>${n.title}</strong><br>${n.body}<br><small>${n.timestamp}</small>`).join('<br><br>') : 
      'No notifications yet.',
    buttons: [
      {
        text: 'Mark All Read',
        handler: () => {
          this.markAllNotificationsAsRead();
        }
      },
      {
        text: 'Clear All',
        handler: () => {
          this.clearAllNotifications();
        }
      },
      {
        text: 'Close',
        role: 'cancel'
      }
    ]
  });

  await alert.present();
}

bursaryDetails(data){
  console.log(data)
  this.router.navigateByUrl('/bursaries', {state:data});
}


//  ngOnInit() {
//     this.data = this.router.getCurrentNavigation().extras.state;
//     console.log(this.data)

// }


 async presentAlert() {
  const alert = await this.alertControllerr.create({
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
        this.router.navigateByUrl('/tabs/tabs/tab3')
      }
    }]
    
  });

  await alert.present();
}
 
 async presentLoadingWithOptions() {
  const loading = await this.load.create({
    spinner: "circles",
    duration: this.loading,
    message: "Please wait",
    translucent: this.loading = false,
    cssClass: "custom-class custom-loading",
    backdropDismiss: true,
  });
  await loading.present();
  const { role, data } = await loading.onDidDismiss();
  console.log("Loading dismissed with role:", role);
}

showMore(){
  this.showContent =false;
  this.readMoreContent =true;
}


async logout() {
  const alert = await this.alertController.create({
    header: 'Sign Out',
    message: 'Are you sure you want to sign out?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Sign Out',
        handler: () => {
          this.performLogout();
        }
      }
    ]
  });
  await alert.present();
}

async performLogout() {
  try {
    // Clear user data and navigate to login
    await this.authService.logout();
    this.router.navigate(['/login']);
    
    const toast = await this.toastController.create({
      message: 'Successfully signed out',
      duration: 2000,
      position: 'middle'
    });
    await toast.present();
  } catch (error) {
    console.error('Logout error:', error);
    const toast = await this.toastController.create({
      message: 'Error signing out. Please try again.',
      duration: 2000,
      position: 'middle'
    });
    await toast.present();
  }
}

async share(){
  let shareRet = await Share.share({
    title: 'See cool stuff',
    text: 'Really awesome thing you need to see right meow',
    url: 'http://ionicframework.com/',
    dialogTitle: 'Share with buddies'
  });
   
}

async presentAlert2() {
  const alert = await this.alertController.create({
    header: 'Are you sure?',
    cssClass: 'custom-alert',
    buttons: [
      {
        text: 'No',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'Yes',
        cssClass: 'alert-button-confirm',
      },
    ],
  });

  await alert.present();
}

// filterData(ev: any) {
//   const val = ev.target.value;
//      if (val && val.trim() != "") {
//         this.opportunities = this.opportunities.filter((item) => {
//         return item.type.toLowerCase().indexOf(val.toLowerCase()) > -1;
//     })
// }}

  // Date filtering methods
  async openDateFilter() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter by Date',
      cssClass: 'date-filter-action-sheet',
      buttons: [
        {
          text: 'Today',
          icon: 'today-outline',
          handler: () => {
            this.applyQuickFilter('today');
          }
        },
        {
          text: 'This Week',
          icon: 'calendar-outline',
          handler: () => {
            this.applyQuickFilter('thisWeek');
          }
        },
        {
          text: 'This Month',
          icon: 'calendar',
          handler: () => {
            this.applyQuickFilter('thisMonth');
          }
        },
        {
          text: 'Next Month',
          icon: 'calendar-clear-outline',
          handler: () => {
            this.applyQuickFilter('nextMonth');
          }
        },
        {
          text: 'Custom Range',
          icon: 'calendar-number-outline',
          handler: () => {
            this.openCustomDateModal();
          }
        },
        {
          text: 'Clear Filter',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.clearAllDateFilters();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  clearDateFilter() {
    this.dateFilter = null;
  }

  applyQuickFilter(filterType: string) {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filterType) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        this.dateFilter = {
          type: 'today',
          startDate: startDate,
          endDate: endDate,
          label: 'Today'
        };
        break;
        
      case 'thisWeek':
        startDate = new Date(today);
        endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.dateFilter = {
          type: 'thisWeek',
          startDate: startDate,
          endDate: endDate,
          label: 'This Week'
        };
        break;
        
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.dateFilter = {
          type: 'thisMonth',
          startDate: startDate,
          endDate: endDate,
          label: 'This Month'
        };
        break;
        
      case 'nextMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        this.dateFilter = {
          type: 'nextMonth',
          startDate: startDate,
          endDate: endDate,
          label: 'Next Month'
        };
        break;
    }
  }

  async openCustomDateModal() {
    const alert = await this.alertControllerr.create({
      header: 'Custom Date Range',
      message: 'Enter your custom date range:',
      inputs: [
        {
          name: 'startDate',
          type: 'date',
          placeholder: 'Start Date',
          value: this.customDateFrom
        },
        {
          name: 'endDate',
          type: 'date',
          placeholder: 'End Date',
          value: this.customDateTo
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            if (data.startDate && data.endDate) {
              this.customDateFrom = data.startDate;
              this.customDateTo = data.endDate;
              this.applyCustomDateFilter();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  applyCustomDateFilter() {
    if (this.customDateFrom && this.customDateTo) {
      this.dateFilter = {
        type: 'custom',
        startDate: new Date(this.customDateFrom),
        endDate: new Date(this.customDateTo),
        label: 'Custom Range'
      };
    }
  }

  clearCustomDates() {
    this.customDateFrom = '';
    this.customDateTo = '';
  }

  clearAllDateFilters() {
    this.dateFilter = null;
    this.customDateFrom = '';
    this.customDateTo = '';
  }

  // Bursary date filtering methods
  async openBursaryDateFilter() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter Bursaries by Date',
      cssClass: 'date-filter-action-sheet',
      buttons: [
        {
          text: 'Today',
          icon: 'today-outline',
          handler: () => {
            this.applyBursaryQuickFilter('today');
          }
        },
        {
          text: 'This Week',
          icon: 'calendar-outline',
          handler: () => {
            this.applyBursaryQuickFilter('thisWeek');
          }
        },
        {
          text: 'This Month',
          icon: 'calendar',
          handler: () => {
            this.applyBursaryQuickFilter('thisMonth');
          }
        },
        {
          text: 'Next Month',
          icon: 'calendar-clear-outline',
          handler: () => {
            this.applyBursaryQuickFilter('nextMonth');
          }
        },
        {
          text: 'Custom Range',
          icon: 'calendar-number-outline',
          handler: () => {
            this.openCustomBursaryDateModal();
          }
        },
        {
          text: 'Clear Filter',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.clearAllBursaryDateFilters();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  clearBursaryDateFilter() {
    this.bursaryDateFilter = null;
  }

  applyBursaryQuickFilter(filterType: string) {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filterType) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        this.bursaryDateFilter = {
          type: 'today',
          startDate: startDate,
          endDate: endDate,
          label: 'Today'
        };
        break;
        
      case 'thisWeek':
        startDate = new Date(today);
        endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        this.bursaryDateFilter = {
          type: 'thisWeek',
          startDate: startDate,
          endDate: endDate,
          label: 'This Week'
        };
        break;
        
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.bursaryDateFilter = {
          type: 'thisMonth',
          startDate: startDate,
          endDate: endDate,
          label: 'This Month'
        };
        break;
        
      case 'nextMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        this.bursaryDateFilter = {
          type: 'nextMonth',
          startDate: startDate,
          endDate: endDate,
          label: 'Next Month'
        };
        break;
    }
  }

  async openCustomBursaryDateModal() {
    const alert = await this.alertControllerr.create({
      header: 'Custom Date Range for Bursaries',
      message: 'Enter your custom date range:',
      inputs: [
        {
          name: 'startDate',
          type: 'date',
          placeholder: 'Start Date',
          value: this.customBursaryDateFrom
        },
        {
          name: 'endDate',
          type: 'date',
          placeholder: 'End Date',
          value: this.customBursaryDateTo
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            if (data.startDate && data.endDate) {
              this.customBursaryDateFrom = data.startDate;
              this.customBursaryDateTo = data.endDate;
              this.applyCustomBursaryDateFilter();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  applyCustomBursaryDateFilter() {
    if (this.customBursaryDateFrom && this.customBursaryDateTo) {
      this.bursaryDateFilter = {
        type: 'custom',
        startDate: new Date(this.customBursaryDateFrom),
        endDate: new Date(this.customBursaryDateTo),
        label: 'Custom Range'
      };
    }
  }

  clearCustomBursaryDates() {
    this.customBursaryDateFrom = '';
    this.customBursaryDateTo = '';
  }

  clearAllBursaryDateFilters() {
    this.bursaryDateFilter = null;
    this.customBursaryDateFrom = '';
    this.customBursaryDateTo = '';
  }

  formatDateFilter(filter: any): string {
    if (!filter) return '';
    
    if (filter.type === 'custom') {
      const startStr = filter.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = filter.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${startStr} - ${endStr}`;
    }
    
    return filter.label;
  }

  getFilteredOpportunities() {
    let filteredOpportunities = this.opportunities;

    // Apply search filter
    if (this.search && this.search.trim() !== '') {
      filteredOpportunities = filteredOpportunities.filter((item) => {
        return item.title?.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
               item.type?.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
               item.studyField?.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
    }

    // Apply date filter
    if (this.dateFilter) {
      filteredOpportunities = filteredOpportunities.filter((item) => {
        if (!item.closingDate) return false;
        
        // Parse the closing date (assuming it's in a readable format)
        let itemDate: Date;
        try {
          itemDate = new Date(item.closingDate);
          // If direct parsing fails, try different formats
          if (isNaN(itemDate.getTime())) {
            // Handle different date formats if needed
            itemDate = this.parseClosingDate(item.closingDate);
          }
        } catch (error) {
          return false;
        }

        if (isNaN(itemDate.getTime())) return false;

        // Check if the item date falls within the filter range
        return itemDate >= this.dateFilter.startDate && itemDate <= this.dateFilter.endDate;
      });
    }

    return filteredOpportunities;
  }

  private parseClosingDate(dateString: string): Date {
    // Handle different date string formats
    // Add more parsing logic here based on your data format
    if (!dateString) return new Date(NaN);
    
    // Try common formats
    const formats = [
      // ISO format
      () => new Date(dateString),
      // MM/DD/YYYY
      () => {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
        return new Date(NaN);
      },
      // DD/MM/YYYY
      () => {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date(NaN);
      },
      // Month DD, YYYY
      () => new Date(Date.parse(dateString))
    ];

    for (const format of formats) {
      try {
        const date = format();
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (error) {
        continue;
      }
    }

    return new Date(NaN);
  }

  getFilteredBursaries() {
    let filteredBursaries = this.bursaries;

    // Apply date filter for bursaries
    if (this.bursaryDateFilter) {
      filteredBursaries = filteredBursaries.filter((item) => {
        if (!item.closingDate) return false;
        
        // Parse the closing date (assuming it's in a readable format)
        let itemDate: Date;
        try {
          itemDate = new Date(item.closingDate);
          // If direct parsing fails, try different formats
          if (isNaN(itemDate.getTime())) {
            // Handle different date formats if needed
            itemDate = this.parseClosingDate(item.closingDate);
          }
        } catch (error) {
          return false;
        }

        if (isNaN(itemDate.getTime())) return false;

        // Check if the item date falls within the filter range
        return itemDate >= this.bursaryDateFilter.startDate && itemDate <= this.bursaryDateFilter.endDate;
      });
    }

    return filteredBursaries;
  }

  // Enhanced date display methods
  isOpportunityClosed(closingDate: string): boolean {
    if (!closingDate) return false;
    
    const closeDate = this.parseClosingDate(closingDate);
    if (isNaN(closeDate.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    closeDate.setHours(23, 59, 59, 999); // Set to end of closing day
    
    return today > closeDate;
  }

  getDateChipColor(closingDate: string): string {
    if (!closingDate) return 'medium';
    
    const closeDate = this.parseClosingDate(closingDate);
    if (isNaN(closeDate.getTime())) return 'medium';
    
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return 'warning'; // Orange for urgent (3 days or less)
    } else if (diffDays <= 7) {
      return 'tertiary'; // Purple for soon (within a week)
    } else {
      return 'success'; // Green for plenty of time
    }
  }

  formatClosingDate(closingDate: string): string {
    if (!closingDate) return 'No date';
    
    const closeDate = this.parseClosingDate(closingDate);
    if (isNaN(closeDate.getTime())) return closingDate; // Return original if can't parse
    
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format the date nicely
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: closeDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    };
    const formattedDate = closeDate.toLocaleDateString('en-US', options);
    
    // Add relative time indicator
    if (diffDays === 0) {
      return `Today`;
    } else if (diffDays === 1) {
      return `Tomorrow`;
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else {
      return formattedDate;
    }
  }

  async showContactDetails() {
    const alert = await this.alertControllerr.create({
      header: 'Contact Information',
      subHeader: 'Get in touch with us',
      message: `
        <div style="text-align: left; line-height: 1.6;">
          <p><strong>👤 Person:</strong><br>Ean Bosman</p>
          <p><strong>📞 Phone:</strong><br><a href="tel:0846894199">084 689 4199</a></p>
          <p><strong>📧 Email:</strong><br><a href="mailto:macdonaldbosman@gmail.com">macdonaldbosman@gmail.com</a></p>
        </div>
      `,
      buttons: [
        {
          text: 'Call',
          handler: () => {
            window.open('tel:0846894199', '_system');
          }
        },
        {
          text: 'Email',
          handler: () => {
            window.open('mailto:macdonaldbosman@gmail.com', '_system');
          }
        },
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
