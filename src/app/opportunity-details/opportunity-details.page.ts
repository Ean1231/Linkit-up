import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-opportunity-details',
  templateUrl: './opportunity-details.page.html',
  styleUrls: ['./opportunity-details.page.scss'],
})
export class OpportunityDetailsPage implements OnInit {
  showdata: any;
  bursaries: any;
  isFavorite: boolean = false;
  favoriteId: string = '';
  
  constructor(
    public router: Router, 
    public service: ServiceService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.service.getBursaries().then((items: any) => {
       console.log(items);
        this.bursaries = items;
     });
  }

  ngOnInit() {
    this.showdata = this.router.getCurrentNavigation().extras.state;
    console.log(this.showdata);
    this.service.getOpportunities();
    
    // Check if this opportunity is already in favorites
    this.checkFavoriteStatus();
  }

  async checkFavoriteStatus() {
    if (this.showdata?.title) {
      try {
        const result: any = await this.service.checkIfFavorite(this.showdata.title);
        this.isFavorite = result.isFavorite;
        this.favoriteId = result.favoriteId;
        console.log('Favorite status:', { isFavorite: this.isFavorite, favoriteId: this.favoriteId });
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
  }

  async shareOpportunity() {
    try {
      if (navigator.share && this.showdata) {
        await navigator.share({
          title: this.showdata.title,
          text: `Check out this opportunity: ${this.showdata.title} at ${this.showdata.institution}`,
          url: this.showdata.link || window.location.href
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
        textArea.value = `Check out this opportunity: ${this.showdata?.title} at ${this.showdata?.institution} - ${this.showdata?.link || window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  }

  async addToFavorites() {
    if (!this.showdata) {
      this.showToast('No opportunity data available', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isFavorite ? 'Removing from favorites...' : 'Adding to favorites...',
      duration: 5000
    });
    await loading.present();

    try {
      if (this.isFavorite) {
        // Remove from favorites
        await this.service.removeFromFavorites(this.favoriteId);
        this.isFavorite = false;
        this.favoriteId = '';
        await this.showToast('Removed from favorites!', 'warning');
      } else {
        // Add to favorites
        const result: any = await this.service.addToFavorites(this.showdata);
        this.isFavorite = true;
        this.favoriteId = result.id;
        await this.showToast('Added to favorites!', 'success');
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
      await this.showToast('Error updating favorites. Please try again.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private async showToast(message: string, color: string = 'success') {
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

  // Getter for heart icon name based on favorite status
  get heartIconName(): string {
    return this.isFavorite ? 'heart' : 'heart-outline';
  }

  // Getter for heart icon color based on favorite status
  get heartIconColor(): string {
    return this.isFavorite ? 'danger' : 'medium';
  }
}
