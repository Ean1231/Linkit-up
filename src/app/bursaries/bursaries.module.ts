import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BursariesPageRoutingModule } from './bursaries-routing.module';

import { BursariesPage } from './bursaries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BursariesPageRoutingModule
  ],
  declarations: [BursariesPage]
})
export class BursariesPageModule {}
