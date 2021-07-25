import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpportunityDetailsPageRoutingModule } from './opportunity-details-routing.module';

import { OpportunityDetailsPage } from './opportunity-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpportunityDetailsPageRoutingModule
  ],
  declarations: [OpportunityDetailsPage]
})
export class OpportunityDetailsPageModule {}
