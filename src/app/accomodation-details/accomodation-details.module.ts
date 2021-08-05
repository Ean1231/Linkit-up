import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccomodationDetailsPageRoutingModule } from './accomodation-details-routing.module';

import { AccomodationDetailsPage } from './accomodation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccomodationDetailsPageRoutingModule
  ],
  declarations: [AccomodationDetailsPage]
})
export class AccomodationDetailsPageModule {}
