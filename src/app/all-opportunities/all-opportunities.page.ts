import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router'
import { IonSearchbar, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-all-opportunities',
  templateUrl: './all-opportunities.page.html',
  styleUrls: ['./all-opportunities.page.scss'],
})
export class AllOpportunitiesPage implements OnInit {
  @ViewChild('search', {static: false}) search: IonSearchbar;
  opportunities = [] ;
data: any;
  searchTerm: string = '';
  
  constructor(
    public service: ServiceService, 
    public router: Router,
    private toastController: ToastController
  ) { 
    this.service.getOpportunities().then((items:any)=>{
      console.log(items);
       this.opportunities = items;
    });
  }

ionViewDidEnter(){
  setTimeout(() => {
    this.search.setFocus()
  }, );
}

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
  
   
  }
  
  details(data){
    console.log(data)
    this.router.navigateByUrl('/opportunity-details', {state:data});
  }


  filterData(ev: any) {
    this.searchTerm = ev.target.value;
  }

  // Date checking methods
  isOpportunityClosed(opportunity: any): boolean {
    if (!opportunity.closingDate) return false;
    
    const currentDate = new Date();
    const closingDate = this.parseClosingDate(opportunity.closingDate);
    
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

  getDateChipColor(opportunity: any): string {
    if (this.isOpportunityClosed(opportunity)) {
      return 'danger';
    }
    
    const closingDate = this.parseClosingDate(opportunity.closingDate);
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

  async shareOpportunity(opportunity: any) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: opportunity.title,
          text: `Check out this opportunity: ${opportunity.title}`,
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
        textArea.value = `Check out this opportunity: ${opportunity.title} - ${window.location.href}`;
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
