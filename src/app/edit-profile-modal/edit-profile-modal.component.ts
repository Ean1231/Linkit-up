import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController, LoadingController, AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { AuthService, User } from '../auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
})
export class EditProfileModalComponent implements OnInit {
  @Input() profileData: User | null = null;
  
  profileForm: FormGroup;
  isLoading = false;
  selectedImage: string | null = null;
  imageFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private platform: Platform,
    private camera: Camera,
    private authService: AuthService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      educationLevel: [''],
      fieldOfStudy: [''],
      profilePicture: ['']
    });
  }

  ngOnInit() {
    if (this.profileData) {
      this.profileForm.patchValue({
        name: this.profileData.name || '',
        surname: this.profileData.surname || '',
        email: this.profileData.email || '',
        phone: this.profileData.phone || '',
        location: this.profileData.location || '',
        educationLevel: this.profileData.educationLevel || '',
        fieldOfStudy: this.profileData.fieldOfStudy || '',
        profilePicture: this.profileData.profilePicture || ''
      });
      
      // Set the current profile picture
      this.selectedImage = this.profileData.profilePicture || null;
    }
  }

  async saveProfile() {
    if (!this.profileForm.valid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: this.imageFile ? 'Uploading image and saving profile...' : 'Saving profile...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      let formData = this.profileForm.value;
      
      // Upload image if a new one was selected
      if (this.imageFile) {
        try {
          // Resize image before upload
          const resizedImage = await this.authService.resizeImage(this.imageFile);
          
          // Delete old profile image if it exists
          if (this.profileData?.profilePicture) {
            await this.authService.deleteProfileImage(this.profileData.profilePicture);
          }
          
          // Upload new image
          const downloadURL = await this.authService.uploadProfileImage(resizedImage);
          formData.profilePicture = downloadURL;
          
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          // Continue with profile update even if image upload fails
          const toast = await this.toastController.create({
            message: 'Image upload failed, but profile will be saved without image.',
            duration: 3000,
            color: 'warning',
            position: 'top'
          });
          await toast.present();
        }
      }
      
      // Update profile (this will be called even if image upload fails)
      await this.authService.updateUserProfile(formData);
      
      await loading.dismiss();
      
      const toast = await this.toastController.create({
        message: 'Profile updated successfully!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
      
      this.modalController.dismiss({
        updated: true,
        data: formData
      });
    } catch (error) {
      await loading.dismiss();
      console.error('Error updating profile:', error);
      
      const toast = await this.toastController.create({
        message: 'Error updating profile. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  async getLocation() {
    const loading = await this.loadingController.create({
      message: 'Getting your location...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const locationData = await this.authService.getCurrentLocation();
      await loading.dismiss();
      
      if (locationData.address) {
        this.profileForm.patchValue({
          location: locationData.address
        });
        
        const toast = await this.toastController.create({
          message: 'Location updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      }
    } catch (error) {
      await loading.dismiss();
      console.error('Error getting location:', error);
      
      const alert = await this.alertController.create({
        header: 'Location Error',
        message: 'Unable to get your current location. Please check your location settings and try again, or enter your location manually.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async changeProfilePicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => {
            this.selectImage('camera');
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'images',
          handler: () => {
            this.selectImage('gallery');
          }
        },
        {
          text: 'Choose File',
          icon: 'folder',
          handler: () => {
            this.selectImageFromFile();
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

  async selectImage(source: 'camera' | 'gallery') {
    if (!this.platform.is('cordova')) {
      // Fallback to file input for web
      this.selectImageFromFile();
      return;
    }

    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: source === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      targetWidth: 300,
      targetHeight: 300
    };

    try {
      const imageData = await this.camera.getPicture(options);
      const base64Image = `data:image/jpeg;base64,${imageData}`;
      
      // Convert base64 to file
      this.imageFile = this.authService.base64ToFile(base64Image, `profile_${Date.now()}.jpg`);
      this.selectedImage = base64Image;
      
    } catch (error) {
      console.error('Error taking picture:', error);
      const toast = await this.toastController.create({
        message: 'Error accessing camera. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
    }
  }

  selectImageFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          this.showToast('Image size must be less than 5MB', 'danger');
          return;
        }
        
        this.imageFile = file;
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
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

  dismiss() {
    this.modalController.dismiss();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
} 