import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllBursaruesPageRoutingModule } from './all-bursarues-routing.module';

import { AllBursaruesPage } from './all-bursarues.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    AllBursaruesPageRoutingModule
  ],
  declarations: [AllBursaruesPage]
})
export class AllBursaruesPageModule {}
