import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router' ;
import { ServiceService } from '../service.service';
import { Location } from '@angular/common';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bursaries',
  templateUrl: './bursaries.page.html',
  styleUrls: ['./bursaries.page.scss'],
})
export class BursariesPage implements OnInit {
  bursaries;
  showdata: any;
  isFavorite: boolean = false;
  
  constructor(
    public router: Router, 
    public service: ServiceService, 
    private location: Location,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getBursaries();
    this.checkIfFavorite();
  }

  // Check if current bursary is already in favorites
  async checkIfFavorite() {
    try {
      const favorites: any = await this.service.getFavorites();
      if (Array.isArray(favorites)) {
        this.isFavorite = favorites.some(fav => fav.id === this.showdata?.id);
      } else {
        this.isFavorite = false;
      }
    } catch (error) {
      console.log('Could not check favorites status:', error);
      this.isFavorite = false;
    }
  }

  // Toggle favorite status
  async toggleFavorite() {
    if (!this.showdata) {
      this.showToast('No bursary data available', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isFavorite ? 'Removing from favorites...' : 'Adding to favorites...',
      duration: 3000
    });
    await loading.present();

    try {
      if (this.isFavorite) {
        // Remove from favorites
        await this.service.removeFromFavorites(this.showdata.id);
        this.isFavorite = false;
        this.showToast('Removed from favorites', 'success');
      } else {
        // Add to favorites using the bursary-specific method
        await this.service.addBursaryToFavorites(this.showdata);
        this.isFavorite = true;
        this.showToast('Added to favorites', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.showToast('Error updating favorites', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  // Share bursary using Web Share API or fallback to clipboard
  async shareBursary(bursary: any) {
    const shareData = {
      title: bursary.title,
      text: `Check out this bursary from ${bursary.company}!`,
      url: window.location.href
    };

    try {
      if ('share' in navigator) {
        await navigator.share(shareData);
      } else {
        console.log('Web Share API not supported');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }

  // Show toast message
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
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

  // Navigate back to previous page
  goBack() {
    this.location.back();
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

  // Check if any coverage benefits are available
  hasAnyCoverage(): boolean {
    if (!this.showdata?.whatsCovered) return false;
    
    return this.showdata.whatsCovered.tuitionFees ||
           this.showdata.whatsCovered.accommodation ||
           this.showdata.whatsCovered.studyMaterial ||
           this.showdata.whatsCovered.livingAllowance;
  }

}

