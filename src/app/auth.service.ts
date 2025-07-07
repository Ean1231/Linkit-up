import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

export interface User {
  uid?: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  phone?: string;
  location?: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  profilePicture?: string;
  joinedDate?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 password: any;
  userData: any;

  constructor(public auth :AngularFireAuth, public afStore: AngularFirestore, private storage: AngularFireStorage) { 
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      // uid: user.uid,
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,

    };
    return userRef.set(userData, {
      merge: true,
    });
    
  }

  Login(email , password) {
    return new Promise((resolve, reject)=>{
      this.auth.signInWithEmailAndPassword(email, password).then(()=>{
        resolve('')
      }).catch((err)=>{
        reject(err)
      })
    })

  }

  Register(user: any) :Promise<any>{

    return this.auth.createUserWithEmailAndPassword(user.email, user.password).then((result)=>{
        let emailLower = user.email.toLowerCase();
        this.afStore.doc('/users/' + emailLower)
        .set({
              name: user.name,
              surname: user.surname,
              email: user.email,
              password: user.password,
        });
        // result.user.sendEmailVerification();
        // this.SendVerificationMail();
        
    }).catch(error => {
      console.log('Auth Service: signup error', error);
  });
  }
 
  SignUp(email, password){
    return new Promise((resolve, reject)=>{
      this.auth.createUserWithEmailAndPassword(email, password).then(()=>{
        resolve('Success')
      }).catch((err)=>{
        reject(err)
      })
    })
  }

  SignIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  forgotPassword(email)
  {

    return new Promise((resolve , reject)=>{
      this.auth.sendPasswordResetEmail(email).then(()=>{
        resolve("Success")


      }).catch((err)=>{
        reject(err)
      })

    })
    
    
  }

  // Get current user ID (email) for favorites and other user-specific operations
  getCurrentUserId(): string | null {
    if (this.userData && this.userData.email) {
      return this.userData.email.toLowerCase();
    }
    
    // Try to get from localStorage as fallback
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'null') {
      try {
        const user = JSON.parse(storedUser);
        return user.email ? user.email.toLowerCase() : null;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        return null;
      }
    }
    
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUserId() !== null;
  }

  // Get current user profile from Firebase
  getCurrentUserProfile(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const currentUserId = this.getCurrentUserId();
      
      if (!currentUserId) {
        resolve(null);
        return;
      }
      
      this.afStore.doc(`users/${currentUserId}`).get().subscribe(
        (doc) => {
          if (doc.exists) {
            const userData = doc.data() as User;
            resolve(userData);
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.error('Error getting user profile:', error);
          reject(error);
        }
      );
    });
  }

  // Update user profile in Firebase
  updateUserProfile(profileData: Partial<User>): Promise<void> {
    return new Promise((resolve, reject) => {
      const currentUserId = this.getCurrentUserId();
      
      if (!currentUserId) {
        reject(new Error('User must be logged in to update profile'));
        return;
      }
      
      // Add timestamp for when profile was updated
      const updateData = {
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      
      this.afStore.doc(`users/${currentUserId}`).update(updateData)
        .then(() => {
          console.log('Profile updated successfully');
          resolve();
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          reject(error);
        });
    });
  }

  // Get user's current location
  getCurrentLocation(): Promise<{latitude: number, longitude: number, address?: string}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          // Try to get address from coordinates
          this.getAddressFromCoords(coords.latitude, coords.longitude)
            .then((address) => {
              resolve({
                ...coords,
                address
              });
            })
            .catch(() => {
              // If reverse geocoding fails, still return coordinates
              resolve(coords);
            });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        }
      );
    });
  }

  // Reverse geocoding to get address from coordinates
  private getAddressFromCoords(lat: number, lng: number): Promise<string> {
    return new Promise((resolve, reject) => {
      // Using a free geocoding service (you might want to use Google Maps API or similar)
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
        .then(response => response.json())
        .then(data => {
          if (data.city || data.locality) {
            const address = `${data.city || data.locality}, ${data.principalSubdivision || data.countryName}`;
            resolve(address);
          } else {
            resolve(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        })
        .catch(error => {
          console.error('Error with reverse geocoding:', error);
          reject(error);
        });
    });
  }

  // Update user location in Firebase
  updateUserLocation(location: string): Promise<void> {
    return this.updateUserProfile({ location });
  }

  // Upload profile image to Firebase Storage
  async uploadProfileImage(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const currentUserId = this.getCurrentUserId();
      
      if (!currentUserId) {
        reject(new Error('User must be logged in to upload profile image'));
        return;
      }
      
      // Create a unique filename
      const fileName = `profile_images/${currentUserId}_${Date.now()}.jpg`;
      const fileRef = this.storage.ref(fileName);
      const uploadTask = this.storage.upload(fileName, imageFile);
      
      uploadTask.snapshotChanges().subscribe(
        (snapshot) => {
          // Handle progress if needed
          if (snapshot && snapshot.bytesTransferred === snapshot.totalBytes) {
            // Upload completed, get download URL
            fileRef.getDownloadURL().subscribe(
              (downloadURL) => {
                // Update user profile with new image URL
                this.updateUserProfile({ profilePicture: downloadURL })
                  .then(() => {
                    console.log('Profile image updated successfully');
                    resolve(downloadURL);
                  })
                  .catch((error) => {
                    console.error('Error updating profile with new image URL:', error);
                    reject(error);
                  });
              },
              (error) => {
                console.error('Error getting download URL:', error);
                reject(error);
              }
            );
          }
        },
        (error) => {
          console.error('Error uploading image:', error);
          reject(error);
        }
      );
    });
  }

  // Convert base64 to File object for upload
  base64ToFile(base64String: string, fileName: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], fileName, { type: mime });
  }

  // Resize image before upload (optional)
  resizeImage(file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(resizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Delete old profile image from storage
  async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      if (imageUrl && imageUrl.includes('firebase')) {
        await this.storage.refFromURL(imageUrl).delete().toPromise();
        console.log('Old profile image deleted');
      }
    } catch (error) {
      console.error('Error deleting old profile image:', error);
      // Don't throw error, as this is not critical
    }
  }

  // Past Papers Storage Methods
  async getPastPapersFiles(): Promise<any[]> {
    try {
      const storageRef = this.storage.ref('past_papers');
      const listRef = await storageRef.listAll().toPromise();
      
      const files = await Promise.all(
        listRef.items.map(async (itemRef) => {
          const downloadURL = await itemRef.getDownloadURL();
          const metadata = await itemRef.getMetadata();
          
          return {
            name: itemRef.name,
            downloadURL,
            metadata,
            size: metadata.size,
            timeCreated: metadata.timeCreated,
            fullPath: itemRef.fullPath
          };
        })
      );
      
      return files;
    } catch (error) {
      console.error('Error getting past papers files:', error);
      throw error;
    }
  }

  async uploadPastPaperFile(file: File, fileName?: string): Promise<string> {
    try {
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const filePath = `past_papers/${finalFileName}`;
      
      const uploadTask = await this.storage.upload(filePath, file);
      const downloadURL = await uploadTask.ref.getDownloadURL();
      
      console.log('Past paper uploaded successfully');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading past paper:', error);
      throw error;
    }
  }

  async deletePastPaperFile(filePath: string): Promise<void> {
    try {
      const fileRef = this.storage.ref(filePath);
      await fileRef.delete();
      console.log('Past paper deleted successfully');
    } catch (error) {
      console.error('Error deleting past paper:', error);
      throw error;
    }
  }

  // Sign out user
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      localStorage.removeItem('user');
      this.userData = null;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  }


