import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: any[] = [];
  loading: boolean = false;
  isEmpty: boolean = false;
  
  constructor(
    private router: Router,
    private service: ServiceService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loadFavorites();
  }

  ionViewWillEnter() {
    this.loadFavorites();
  }

  async loadFavorites() {
    this.loading = true;
    
    try {
      const favorites: any = await this.service.getFavorites();
      this.favorites = favorites || [];
      this.isEmpty = this.favorites.length === 0;
      console.log('Loaded favorites:', this.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = [];
      this.isEmpty = true;
      
      if (error.message && error.message.includes('logged in')) {
        this.showToast('Please log in to view your saved items', 'warning');
        this.router.navigate(['/login']);
      } else {
        this.showToast('Error loading favorites', 'danger');
      }
    } finally {
      this.loading = false;
    }
  }

  async removeFromFavorites(favorite: any) {
    const alert = await this.alertController.create({
      header: 'Remove Favorite',
      message: `Are you sure you want to remove "${favorite.title}" from your saved items?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Remove',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Removing...',
              duration: 3000
            });
            await loading.present();

            try {
              await this.service.removeFromFavorites(favorite.id);
              this.favorites = this.favorites.filter(f => f.id !== favorite.id);
              this.isEmpty = this.favorites.length === 0;
              this.showToast('Removed from favorites', 'success');
            } catch (error) {
              console.error('Error removing favorite:', error);
              this.showToast('Error removing favorite', 'danger');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  viewDetails(favorite: any) {
    if (favorite.category === 'opportunity') {
      this.router.navigate(['/opportunity-details'], { state: favorite });
    } else if (favorite.category === 'bursary') {
      this.router.navigate(['/bursaries'], { state: favorite });
    }
  }

  async shareItem(favorite: any) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: favorite.title,
          text: `Check out this ${favorite.category}: ${favorite.title}`,
          url: favorite.link || window.location.href
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
        textArea.value = `Check out this ${favorite.category}: ${favorite.title} - ${favorite.link || window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  }

  async refreshFavorites(event: any) {
    await this.loadFavorites();
    event.target.complete();
  }

  private async showToast(message: string, color: string = 'success') {
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

  goBack() {
    this.router.navigate(['/tabs/tabs/tab3']);
  }
} 