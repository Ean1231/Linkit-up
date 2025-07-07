import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ActionSheetController, ModalController, LoadingController } from '@ionic/angular';
import { AuthService, User } from '../auth.service';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userProfile: User | null = null;
  isLoading = false;
  savedItemsCount = 0;
  applicationsCount = 0;
  achievementsCount = 0;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  ionViewWillEnter() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading = true;
    
    try {
      // Load user profile from Firebase
      const profile = await this.authService.getCurrentUserProfile();
      this.userProfile = profile;
      
      // Load user statistics
      await this.loadUserStats();
      
      console.log('User profile loaded:', this.userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.showToast('Error loading profile data', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async loadUserStats() {
    try {
      // Load favorites count
      const favorites = await this.serviceService.getFavorites();
      this.savedItemsCount = Array.isArray(favorites) ? favorites.length : 0;
      
      // Set default values for applications and achievements
      this.applicationsCount = 0;
      this.achievementsCount = 0;
    } catch (error) {
      console.error('Error loading user stats:', error);
      this.savedItemsCount = 0;
    }
  }

  async editProfile() {
    const modal = await this.modalController.create({
      component: EditProfileModalComponent,
      componentProps: {
        profileData: this.userProfile
      }
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data?.updated) {
      // Reload the profile data
      await this.loadUserProfile();
      this.showToast('Profile updated successfully!', 'success');
    }
  }

  async changeAvatar() {
    // Open edit profile modal for changing avatar
    await this.editProfile();
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Change Password',
      message: 'Password change feature coming soon!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async notificationSettings() {
    const alert = await this.alertController.create({
      header: 'Notification Settings',
      message: 'Notification settings coming soon!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async privacySettings() {
    const alert = await this.alertController.create({
      header: 'Privacy Settings',
      message: 'Privacy settings coming soon!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async aboutApp() {
    const alert = await this.alertController.create({
      header: 'About Linkit-up',
      message: 'Linkit-up v1.0\n\nYour gateway to educational opportunities, bursaries, and career development.',
      buttons: ['OK']
    });
    await alert.present();
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

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
} 