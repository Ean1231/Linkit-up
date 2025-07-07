import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router' ;
import { ServiceService } from '../service.service'

@Component({
  selector: 'app-bursaries',
  templateUrl: './bursaries.page.html',
  styleUrls: ['./bursaries.page.scss'],
})
export class BursariesPage implements OnInit {
  bursaries;
  showdata: any;
  constructor(public router: Router, public service: ServiceService) { }

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getBursaries();
  }

  // Date checking methods
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

  private parseClosingDate(dateString: string): Date {
    // Handle different date string formats
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

}

