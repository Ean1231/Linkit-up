import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ActionSheetController, ModalController, LoadingController } from '@ionic/angular';
import { AuthService, User } from '../auth.service';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { ServiceService } from '../service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';

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
    private serviceService: ServiceService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
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
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Current Password',
          cssClass: 'custom-alert-input'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password',
          cssClass: 'custom-alert-input'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirm New Password',
          cssClass: 'custom-alert-input'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change Password',
          handler: async (data) => {
            // Validate inputs
            if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
              this.showToast('Please fill in all fields', 'warning');
              return false;
            }

            if (data.newPassword !== data.confirmPassword) {
              this.showToast('New passwords do not match', 'warning');
              return false;
            }

            if (data.newPassword.length < 6) {
              this.showToast('New password must be at least 6 characters', 'warning');
              return false;
            }

            // Show loading
            const loading = await this.loadingController.create({
              message: 'Changing password...',
              spinner: 'crescent'
            });
            await loading.present();

            try {
              // Get current user
              const user = await this.authService.auth.currentUser;
              if (!user || !user.email) {
                throw new Error('No user logged in');
              }

              // Reauthenticate with current password
              const credential = await this.authService.auth.signInWithEmailAndPassword(
                user.email,
                data.currentPassword
              );

              // Update password
              await user.updatePassword(data.newPassword);
              
              await loading.dismiss();
              this.showToast('Password changed successfully', 'success');
            } catch (error) {
              await loading.dismiss();
              
              if (error.code === 'auth/wrong-password') {
                this.showToast('Current password is incorrect', 'danger');
              } else if (error.code === 'auth/requires-recent-login') {
                this.showToast('Please log out and log in again before changing password', 'warning');
              } else {
                console.error('Error changing password:', error);
                this.showToast('Error changing password. Please try again.', 'danger');
              }
              return false;
            }
          }
        }
      ]
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

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'This action cannot be undone. Please enter your password to confirm account deletion.',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Enter your password',
          cssClass: 'custom-alert-input'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete Account',
          cssClass: 'alert-button-danger',
          handler: async (data) => {
            if (!data.password) {
              this.showToast('Please enter your password', 'warning');
              return false;
            }

            const loading = await this.loadingController.create({
              message: 'Deleting account...'
            });
            await loading.present();

            try {
              // Get current user
              const user = await this.afAuth.currentUser;
              if (!user || !user.email) {
                throw new Error('No user found');
              }

              // Create credential for reauthentication
              const credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                data.password
              );

              // Reauthenticate user before deletion
              await user.reauthenticateWithCredential(credential);

              // Delete user data from Firestore first
              await this.firestore.doc(`users/${user.uid}`).delete();
              
              // Delete any other user-related data (favorites)
              const favoritesRef = this.firestore.collection('favorites');
              const userFavorites = await favoritesRef.ref.where('userId', '==', user.uid).get();
              
              const batch = this.firestore.firestore.batch();
              userFavorites.forEach((doc) => {
                batch.delete(doc.ref);
              });
              await batch.commit();

              // Finally delete the user account
              await user.delete();

              await loading.dismiss();
              this.showToast('Account deleted successfully', 'success');
              
              // Navigate to welcome page
              this.router.navigate(['/welcome'], { replaceUrl: true });

            } catch (error) {
              await loading.dismiss();
              if (error.code === 'auth/wrong-password') {
                this.showToast('Incorrect password', 'danger');
              } else {
                this.showToast('Failed to delete account: ' + error.message, 'danger');
              }
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
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