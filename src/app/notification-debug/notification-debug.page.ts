import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-notification-debug',
  templateUrl: './notification-debug.page.html',
  styleUrls: ['./notification-debug.page.scss'],
})
export class NotificationDebugPage implements OnInit {
  fcmToken: string | null = null;
  notificationPermission: string = 'unknown';
  serviceWorkerRegistered: boolean = false;
  platformInfo: any = {};
  messages: any[] = [];
  
  constructor(
    private notificationService: NotificationService,
    private platform: Platform
  ) { }

  async ngOnInit() {
    await this.checkFCMStatus();
    this.listenForMessages();
  }

  async checkFCMStatus() {
    // Check notification permission
    this.notificationPermission = Notification.permission;
    
    // Get FCM token
    this.fcmToken = this.notificationService.getStoredToken();
    
    // Check service worker registration
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
        this.serviceWorkerRegistered = !!registration;
        console.log('Service Worker registration:', registration);
      } catch (error) {
        console.error('Error checking service worker:', error);
      }
    }
    
    // Platform info
    this.platformInfo = {
      isWeb: this.platform.is('pwa') || this.platform.is('desktop'),
      isCapacitor: this.platform.is('capacitor'),
      isMobile: this.platform.is('mobile'),
      platforms: this.platform.platforms()
    };
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      console.log('Permission result:', permission);
      
      if (permission === 'granted') {
        await this.generateToken();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  }

  async generateToken() {
    try {
      const token = await this.notificationService.getToken();
      this.fcmToken = token;
      console.log('Generated FCM Token:', token);
    } catch (error) {
      console.error('Error generating token:', error);
    }
  }

  async testNotification() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification('Test Notification', {
        body: 'This is a test notification from your app!',
        icon: '/assets/icon/favicon.png',
        badge: '/assets/icon/favicon.png'
      });
    }
  }

  copyToken() {
    if (this.fcmToken) {
      navigator.clipboard.writeText(this.fcmToken);
      console.log('Token copied to clipboard');
    }
  }

  listenForMessages() {
    this.notificationService.currentMessage.subscribe((message) => {
      if (message) {
        console.log('Debug: Message received:', message);
        this.messages.unshift({
          ...message,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  clearMessages() {
    this.messages = [];
  }
} 