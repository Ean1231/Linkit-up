import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { IonSearchbar, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-all-bursarues',
  templateUrl: './all-bursarues.page.html',
  styleUrls: ['./all-bursarues.page.scss'],
})
export class AllBursaruesPage implements OnInit {
  @ViewChild('search', {static: false}) search: IonSearchbar;
  bursaries = [];
data: any;
  loading: boolean;
  searchTerm: string = '';

  constructor(
    private service: ServiceService, 
    public router: Router,
    private toastController: ToastController
  ) {
    this.loading = true;
    this.service.getBursaries().then((items: any) => {
        console.log(items);
        this.bursaries = items;
        this.loading = false;
     });
   }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 150);
  }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data);
  }

  filterData(ev: any) {
    this.searchTerm = ev.target.value;
  }

  bursaryDetails(data) {
    console.log(data);
    this.router.navigateByUrl('/bursaries', {state: data});
  }

  // Date checking methods
  isBursaryClosed(bursary: any): boolean {
    if (!bursary.closingDate) return false;
    
    const currentDate = new Date();
    const closingDate = this.parseClosingDate(bursary.closingDate);
    
    return closingDate < currentDate;
  }

  parseClosingDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    // Handle various date formats
    const cleanDate = dateString.replace(/[^\d\/\-\s]/g, '');
    
    // Try different date formats
    const formats = [
      () => new Date(dateString), // ISO format
      () => new Date(cleanDate), // Clean format
      () => {
        const parts = cleanDate.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      },
      () => {
        const parts = cleanDate.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return null;
      }
    ];
    
    for (const format of formats) {
      try {
        const date = format();
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        continue;
      }
    }
    
    return new Date();
  }

  formatClosingDate(dateString: string): string {
    if (!dateString) return 'No date specified';
    
    const closingDate = this.parseClosingDate(dateString);
    const currentDate = new Date();
    const timeDiff = closingDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return 'CLOSED';
    } else if (daysDiff === 0) {
      return 'Today';
    } else if (daysDiff === 1) {
      return 'Tomorrow';
    } else if (daysDiff <= 7) {
      return `${daysDiff} days left`;
    } else {
      return dateString;
    }
  }

  getDateChipColor(bursary: any): string {
    if (this.isBursaryClosed(bursary)) {
      return 'danger';
    }
    
    const closingDate = this.parseClosingDate(bursary.closingDate);
    const currentDate = new Date();
    const timeDiff = closingDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 3) {
      return 'warning';
    } else if (daysDiff <= 7) {
      return 'tertiary';
    } else {
      return 'success';
    }
  }

  async shareBursary(bursary: any) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: bursary.title,
          text: `Check out this bursary: ${bursary.title}`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const toast = await this.toastController.create({
          message: 'Link copied to clipboard!',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
        
        // Copy to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = `Check out this bursary: ${bursary.title} - ${window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.log('Error sharing:', error);
  }
  }
}
