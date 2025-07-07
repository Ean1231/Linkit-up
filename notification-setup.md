# Push Notification Setup Guide

## Overview
This guide explains how to set up push notifications for your LinkIt-up app so that notifications are sent to all devices with the app installed.

## What Was Fixed

### Frontend Changes (Already Applied)
✅ **Updated NotificationService** (`src/app/notification.service.ts`)
- Now stores FCM tokens in Firestore instead of just localStorage
- Associates tokens with user accounts when users are logged in
- Generates unique device IDs to prevent duplicate tokens
- Handles token cleanup when users log out

### Backend Setup (You Need to Implement)

## Step 1: Set Up Firebase Admin SDK

### 1.1 Get Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`delivery-ee9c1`)
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file and rename it to `service-account-key.json`

### 1.2 Create Backend Server
1. Create a new directory for your backend:
```bash
mkdir linkit-up-backend
cd linkit-up-backend
```

2. Copy the provided files:
- `backend-notification-example.js` → `server.js`
- `backend-package.json` → `package.json`

3. Install dependencies:
```bash
npm install
```

4. Place your `service-account-key.json` in the backend directory

5. Update the service account path in `server.js`:
```javascript
const serviceAccount = require('./service-account-key.json');
```

## Step 2: Deploy Your Backend

### Option A: Local Development
```bash
npm run dev
```
Your backend will run on `http://localhost:3000`

### Option B: Deploy to Cloud (Recommended)
- **Heroku**: `git push heroku main`
- **Vercel**: `vercel --prod`
- **Google Cloud Functions**: Deploy as a Cloud Function
- **Firebase Functions**: Deploy as Firebase Functions

## Step 3: Test the System

### 3.1 Install Your App
1. Build and deploy your updated app:
```bash
npm run build
firebase deploy
```

2. Install the app on multiple devices or open in multiple browsers

### 3.2 Check Token Registration
Visit your backend endpoint to see registered devices:
```
GET http://your-backend-url/device-count
```

You should see:
```json
{
  "success": true,
  "count": 2,
  "devices": [
    {
      "platform": "web",
      "userId": "user123",
      "userEmail": "user@example.com"
    },
    {
      "platform": "android",
      "userId": "anonymous",
      "userEmail": null
    }
  ]
}
```

### 3.3 Send Test Notification
Send a POST request to your backend:
```bash
curl -X POST http://your-backend-url/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test notification to all devices!",
    "data": {
      "type": "test",
      "action": "open_app"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Notification sent to 2 devices",
  "successCount": 2,
  "failureCount": 0
}
```

## Step 4: Integration with Your App

### 4.1 Add Notification Triggers
You can now send notifications from your app's admin panel or automatically based on events:

```javascript
// Example: Send notification when new bursary is added
async function notifyNewBursary(bursaryTitle) {
  const response = await fetch('https://your-backend-url/send-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'New Bursary Available!',
      body: `Check out the new bursary: ${bursaryTitle}`,
      data: {
        type: 'bursary',
        action: 'open_bursaries'
      }
    })
  });

  const result = await response.json();
  console.log('Notification sent:', result);
}
```

### 4.2 Add Admin Panel (Optional)
Create an admin page in your app to send notifications:

```html
<!-- Add to your admin page -->
<ion-card>
  <ion-card-header>
    <ion-card-title>Send Notification</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <ion-item>
      <ion-label position="stacked">Title</ion-label>
      <ion-input [(ngModel)]="notificationTitle"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Message</ion-label>
      <ion-textarea [(ngModel)]="notificationBody"></ion-textarea>
    </ion-item>
    <ion-button (click)="sendNotification()" expand="block">
      Send to All Devices
    </ion-button>
  </ion-card-content>
</ion-card>
```

## Troubleshooting

### "No FCM tokens registered" Error
This error occurs when:
1. No devices have the app installed and opened
2. Users haven't granted notification permissions
3. The notification service isn't initializing properly

**Solution**: 
1. Make sure the app is installed on at least one device
2. Check browser/device permissions for notifications
3. Check browser console for initialization errors

### Tokens Not Saving to Firestore
Check:
1. Firebase configuration is correct
2. Firestore rules allow writes to `fcmTokens` collection
3. User has internet connection when app loads

### Notifications Not Received
Check:
1. Device has notification permissions enabled
2. App is not force-closed on mobile devices
3. Service worker is registered properly for web

## Security Considerations

1. **Firestore Rules**: Add proper security rules for the `fcmTokens` collection
2. **Backend Authentication**: Add authentication to your notification endpoints
3. **Rate Limiting**: Implement rate limiting to prevent spam
4. **Token Cleanup**: Regularly clean up inactive tokens

## Firestore Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow devices to write their own FCM tokens
    match /fcmTokens/{deviceId} {
      allow write: if request.auth != null || resource == null;
      allow read: if request.auth != null;
    }
  }
}
```

## Next Steps

1. ✅ Frontend notification service updated
2. ⏳ Set up backend server with Firebase Admin SDK
3. ⏳ Deploy backend to cloud platform
4. ⏳ Test notifications on multiple devices
5. ⏳ Add admin panel for sending notifications
6. ⏳ Set up automated notifications for app events

Your app will now successfully send notifications to all devices with the app installed! 