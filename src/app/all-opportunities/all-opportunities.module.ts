import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllOpportunitiesPageRoutingModule } from './all-opportunities-routing.module';

import { AllOpportunitiesPage } from './all-opportunities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllOpportunitiesPageRoutingModule
  ],
  declarations: [AllOpportunitiesPage]
})
export class AllOpportunitiesPageModule {}
