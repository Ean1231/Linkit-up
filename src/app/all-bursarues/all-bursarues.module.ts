import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllBursaruesPageRoutingModule } from './all-bursarues-routing.module';

import { AllBursaruesPage } from './all-bursarues.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllBursaruesPageRoutingModule
  ],
  declarations: [AllBursaruesPage]
})
export class AllBursaruesPageModule {}
