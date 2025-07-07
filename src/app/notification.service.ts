import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSource = new BehaviorSubject<any>(null);
  public currentMessage = this.messageSource.asObservable();

  constructor(
    private afMessaging: AngularFireMessaging,
    private alertController: AlertController,
    private platform: Platform,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }

  // Initialize Firebase Cloud Messaging
  async initializeFirebaseMessaging() {
    try {
      console.log('Initializing Firebase Messaging...');
      
      // Initialize messaging first
      this.listenForMessages();
      
      // Request notification permission
      const permission = await this.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        
        // Get FCM token
        const token = await this.getToken();
        console.log('FCM Token:', token);
        
        if (token) {
          console.log('✅ FCM setup complete! Token:', token);
          console.log('📱 You can now send notifications using this token');
        }
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error initializing Firebase Messaging:', error);
    }
  }

  // Request notification permission
  private async requestPermission(): Promise<string> {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Get FCM token
  async getToken(): Promise<string | null> {
    try {
      // Register service worker for background messages
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('🔧 Service Worker registered:', registration);
      }
      
      console.log('🔑 Requesting FCM token...');
      const token = await this.afMessaging.getToken.pipe(take(1)).toPromise();
      if (token) {
        console.log('✅ FCM Token generated:', token);
        // Store this token in Firestore
        await this.storeTokenInFirestore(token);
        localStorage.setItem('fcmToken', token);
        return token;
      } else {
        console.log('❌ No FCM token generated');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      console.error('Details:', error);
      return null;
    }
  }

  // Store FCM token in Firestore
  private async storeTokenInFirestore(token: string) {
    try {
      const user = await this.auth.currentUser;
      const deviceId = this.generateDeviceId();
      
      const tokenData = {
        token: token,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || null,
        deviceId: deviceId,
        platform: this.platform.is('android') ? 'android' : this.platform.is('ios') ? 'ios' : 'web',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true
      };

      // Store token with device ID as document ID to prevent duplicates
      await this.firestore.collection('fcmTokens').doc(deviceId).set(tokenData);
      console.log('✅ FCM token stored in Firestore:', tokenData);
    } catch (error) {
      console.error('❌ Error storing FCM token in Firestore:', error);
    }
  }

  // Generate unique device ID
  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  // Get all FCM tokens from Firestore (for backend use)
  async getAllTokens(): Promise<any[]> {
    try {
      const snapshot = await this.firestore.collection('fcmTokens', ref => 
        ref.where('active', '==', true)
      ).get().toPromise();
      
      const tokens = [];
      snapshot.forEach(doc => {
        const data = doc.data() as any;
        tokens.push({
          id: doc.id,
          token: data.token,
          userId: data.userId,
          userEmail: data.userEmail,
          deviceId: data.deviceId,
          platform: data.platform,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          active: data.active
        });
      });
      
      console.log('📋 Retrieved FCM tokens:', tokens);
      return tokens;
    } catch (error) {
      console.error('❌ Error retrieving FCM tokens:', error);
      return [];
    }
  }

  // Listen for incoming messages
  private listenForMessages() {
    console.log('🔄 Starting to listen for FCM messages...');
    this.afMessaging.messages.subscribe(
      (payload) => {
        console.log('📨 Message received:', payload);
        this.messageSource.next(payload);
        this.showNotification(payload);
      },
      (error) => {
        console.error('❌ Error listening for messages:', error);
      }
    );
  }

  // Show notification alert
  private async showNotification(payload: any) {
    const alert = await this.alertController.create({
      header: payload.notification?.title || 'New Notification',
      message: payload.notification?.body || 'You have a new notification',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        },
        {
          text: 'View',
          handler: () => {
            // Handle notification action
            this.handleNotificationAction(payload);
          }
        }
      ]
    });

    await alert.present();
  }

  // Handle notification action
  private handleNotificationAction(payload: any) {
    console.log('Handling notification action:', payload);
    // Add your custom logic here based on notification data
    // For example, navigate to a specific page based on the notification type
  }

  // Delete FCM token (for logout)
  async deleteToken() {
    try {
      const token = this.getStoredToken();
      const deviceId = this.generateDeviceId();
      
      if (token) {
        await this.afMessaging.deleteToken(token);
        localStorage.removeItem('fcmToken');
        
        // Mark token as inactive in Firestore
        await this.firestore.collection('fcmTokens').doc(deviceId).update({
          active: false,
          updatedAt: new Date()
        });
        
        console.log('FCM token deleted and marked inactive');
      }
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  }

  // Get stored FCM token
  getStoredToken(): string | null {
    return localStorage.getItem('fcmToken');
  }
} 