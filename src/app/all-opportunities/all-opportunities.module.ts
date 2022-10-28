import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllOpportunitiesPageRoutingModule } from './all-opportunities-routing.module';

import { AllOpportunitiesPage } from './all-opportunities.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    AllOpportunitiesPageRoutingModule
  ],
  declarations: [AllOpportunitiesPage]
})
export class AllOpportunitiesPageModule {}
