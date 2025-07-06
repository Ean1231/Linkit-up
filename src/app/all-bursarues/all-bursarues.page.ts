import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { IonSearchbar, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-all-bursarues',
  templateUrl: './all-bursarues.page.html',
  styleUrls: ['./all-bursarues.page.scss'],
})
export class AllBursaruesPage implements OnInit {
  @ViewChild('search', {static: false}) search: IonSearchbar;
  bursaries = [];
data: any;
  loading: boolean;
  searchTerm: string = '';

  constructor(
    private service: ServiceService, 
    public router: Router,
    private toastController: ToastController
  ) {
    this.loading = true;
    this.service.getBursaries().then((items: any) => {
        console.log(items);
        this.bursaries = items;
        this.loading = false;
     });
   }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    }, 150);
  }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data);
  }

  filterData(ev: any) {
    this.searchTerm = ev.target.value;
  }

  bursaryDetails(data) {
    console.log(data);
    this.router.navigateByUrl('/bursaries', {state: data});
  }

  async shareBursary(bursary: any) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: bursary.title,
          text: `Check out this bursary: ${bursary.title}`,
          url: window.location.href
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
        textArea.value = `Check out this bursary: ${bursary.title} - ${window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.log('Error sharing:', error);
  }
  }
}
