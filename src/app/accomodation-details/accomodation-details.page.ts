import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-accomodation-details',
  templateUrl: './accomodation-details.page.html',
  styleUrls: ['./accomodation-details.page.scss'],
})
export class AccomodationDetailsPage implements OnInit {
  showdata: any;

  // Slide options for image carousel
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 0,
    centeredSlides: true,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  };

  constructor(
    public roter: Router, 
    public service: ServiceService,
    private modalController: ModalController,
    private alertController: AlertController,
    private location: Location
  ) { }

  ngOnInit() {
    this.showdata = this.roter.getCurrentNavigation().extras.state;
    console.log(this.showdata)   
    this.service.getAccomodation();
  }

  // Navigate back to previous page
  goBack() {
    this.location.back();
  }

  // Open image in modal for full view
  async openImageModal(imageUrl: string) {
    const alert = await this.alertController.create({
      cssClass: 'image-modal',
      message: `
        <div class="image-modal-content">
          <img src="${imageUrl}" alt="Accommodation Image" style="width: 100%; height: auto; border-radius: 8px;">
        </div>
      `,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }

  // Get availability status based on closing date
  getAvailabilityStatus(): string {
    if (!this.showdata.closingDate && !this.showdata.availableUntil) {
      return 'Contact for Details';
    }

    const currentDate = new Date();
    const closingDate = this.parseClosingDate(this.showdata.closingDate || this.showdata.availableUntil);
    
    if (closingDate < currentDate) {
      return 'Currently Closed';
    }

    const timeDiff = closingDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 0) {
      return 'Closing Today';
    } else if (daysDiff === 1) {
      return 'Closes Tomorrow';
    } else if (daysDiff <= 7) {
      return `${daysDiff} days remaining`;
    } else {
      return 'Available Now';
    }
  }

  // Parse closing date from string
  parseClosingDate(dateString: string): Date {
    if (!dateString) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const cleanDate = dateString.replace(/[^\d\/\-\s]/g, '');
    
    const formats = [
      () => new Date(dateString),
      () => new Date(cleanDate),
      () => {
        const parts = cleanDate.split('/');
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return null;
      },
      () => {
        const parts = cleanDate.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return null;
      }
    ];
    
    for (const format of formats) {
      try {
        const date = format();
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        continue;
      }
    }
    
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
}
