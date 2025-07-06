import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router'
import { IonSearchbar, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-all-opportunities',
  templateUrl: './all-opportunities.page.html',
  styleUrls: ['./all-opportunities.page.scss'],
})
export class AllOpportunitiesPage implements OnInit {
  @ViewChild('search', {static: false}) search: IonSearchbar;
  opportunities = [] ;
data: any;
  searchTerm: string = '';
  
  constructor(
    public service: ServiceService, 
    public router: Router,
    private toastController: ToastController
  ) { 
    this.service.getOpportunities().then((items:any)=>{
      console.log(items);
       this.opportunities = items;
    });
  }

ionViewDidEnter(){
  setTimeout(() => {
    this.search.setFocus()
  }, );
}

  ngOnInit() {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data)
  
   
  }
  
  details(data){
    console.log(data)
    this.router.navigateByUrl('/opportunity-details', {state:data});
  }


  filterData(ev: any) {
    this.searchTerm = ev.target.value;
  }

  async shareOpportunity(opportunity: any) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: opportunity.title,
          text: `Check out this opportunity: ${opportunity.title}`,
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
        textArea.value = `Check out this opportunity: ${opportunity.title} - ${window.location.href}`;
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
