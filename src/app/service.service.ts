import { Injectable } from '@angular/core';

import { AngularFirestore} from '@angular/fire/firestore';
import { RegistrationPage } from './registration/registration.page';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
listUniversities = [];
listopportuniites = [];
listbursaries = [];
listAccomodation = [];
listFavorites = [];

  constructor( public firestore:AngularFirestore, private auth: AuthService) { }

  getVarsities(){
    return new Promise((res, rej)=>{
      this.firestore.collection('Add').valueChanges().subscribe((items: any) => {
        this.listUniversities = items;
        //console.log(items)
        res(this.listUniversities) ;
        })
    })   
  }
  
  getOpportunities(){
    return new Promise((res, rej)=>{
      this.firestore.collection('timeline').valueChanges().subscribe((items: any) => {
        this.listopportuniites = items;
        //console.log(items)
        res(this.listopportuniites) ;
        })
    })
  }

  getBursaries(){
    return new Promise((res, rej)=>{
      this.firestore.collection('bursaries').valueChanges().subscribe((items: any) => {
        this.listbursaries = items;
        //console.log(items)
        res(this.listbursaries) ;
        })
    })
  }
  
  getAccomodation(){
    return new Promise((res, rej)=>{
      this.firestore.collection('accomodation').valueChanges().subscribe((items: any) => {
        this.listAccomodation = items;
        //console.log(items)
        res(this.listAccomodation) ;
        })
    })
  }
  
  // Favorites Management
  addToFavorites(opportunity: any) {
    return new Promise((resolve, reject) => {
      try {
        // Get current user ID
        const currentUserId = this.auth.getCurrentUserId();
        
        if (!currentUserId) {
          reject(new Error('User must be logged in to add favorites'));
          return;
        }

        // Create a unique ID for the favorite item
        const favoriteId = this.firestore.createId();
        
        // Prepare the favorite object with proper null checks
        const favoriteItem = {
          id: favoriteId,
          opportunityId: opportunity.id || favoriteId,
          title: opportunity.title || 'Untitled Opportunity',
          description: opportunity.description || 'No description available',
          institution: opportunity.institution || 'Unknown Institution',
          closingDate: opportunity.closingDate || null,
          type: opportunity.type || 'opportunity',
          img: opportunity.img || null,
          link: opportunity.link || null,
          email: opportunity.email || null,
          location: opportunity.location || null,
          contact: opportunity.contact || null,
          userId: currentUserId, // Use current logged-in user's ID
          dateAdded: new Date().toISOString(),
          category: 'opportunity' // To distinguish from bursary favorites
        };

        // Add to favorites collection
        this.firestore.collection('favorites').doc(favoriteId).set(favoriteItem)
          .then(() => {
            console.log('Added to favorites successfully for user:', currentUserId);
            resolve(favoriteItem);
          })
          .catch((error) => {
            console.error('Error adding to favorites:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error in addToFavorites:', error);
        reject(error);
      }
    });
  }

  removeFromFavorites(favoriteId: string) {
    return new Promise((resolve, reject) => {
      this.firestore.collection('favorites').doc(favoriteId).delete()
        .then(() => {
          console.log('Removed from favorites successfully');
          resolve(true);
        })
        .catch((error) => {
          console.error('Error removing from favorites:', error);
          reject(error);
        });
    });
  }

  getFavorites() {
    return new Promise((resolve, reject) => {
      const currentUserId = this.auth.getCurrentUserId();
      
      if (!currentUserId) {
        reject(new Error('User must be logged in to view favorites'));
        return;
      }
      
      this.firestore.collection('favorites', ref => ref.where('userId', '==', currentUserId))
        .valueChanges().subscribe((items: any) => {
          this.listFavorites = items;
          console.log('Favorites retrieved for user:', currentUserId, items);
          resolve(this.listFavorites);
        }, (error) => {
          console.error('Error getting favorites:', error);
          reject(error);
        });
    });
  }

  checkIfFavorite(opportunityTitle: string) {
    return new Promise((resolve, reject) => {
      const currentUserId = this.auth.getCurrentUserId();
      
      if (!currentUserId) {
        // If user is not logged in, return false for favorite status
        resolve({ isFavorite: false, favoriteId: null });
        return;
      }
      
      this.firestore.collection('favorites', ref => 
        ref.where('userId', '==', currentUserId)
           .where('title', '==', opportunityTitle)
      ).get().subscribe((querySnapshot) => {
        const isFavorite = !querySnapshot.empty;
        const favoriteId = isFavorite ? querySnapshot.docs[0].id : null;
        console.log('Favorite status for user:', currentUserId, 'title:', opportunityTitle, 'isFavorite:', isFavorite);
        resolve({ isFavorite, favoriteId });
      }, (error) => {
        console.error('Error checking favorite status:', error);
        reject(error);
      });
    });
  }

  // Method to add bursary to favorites (similar structure)
  addBursaryToFavorites(bursary: any) {
    return new Promise((resolve, reject) => {
      try {
        // Get current user ID
        const currentUserId = this.auth.getCurrentUserId();
        
        if (!currentUserId) {
          reject(new Error('User must be logged in to add favorites'));
          return;
        }

        const favoriteId = this.firestore.createId();
        
        const favoriteItem = {
          id: favoriteId,
          bursaryId: bursary.id || favoriteId,
          title: bursary.title || 'Untitled Bursary',
          description: bursary.description || 'No description available',
          closingDate: bursary.closingDate || null,
          img: bursary.img || null,
          link: bursary.link || null,
          userId: currentUserId, // Use current logged-in user's ID
          dateAdded: new Date().toISOString(),
          category: 'bursary' // To distinguish from opportunity favorites
        };

        this.firestore.collection('favorites').doc(favoriteId).set(favoriteItem)
          .then(() => {
            console.log('Bursary added to favorites successfully for user:', currentUserId);
            resolve(favoriteItem);
          })
          .catch((error) => {
            console.error('Error adding bursary to favorites:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error in addBursaryToFavorites:', error);
        reject(error);
      }
    });
  }
}
