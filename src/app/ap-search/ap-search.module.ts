import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApSearchPageRoutingModule } from './ap-search-routing.module';

import { ApSearchPage } from './ap-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApSearchPageRoutingModule
  ],
  declarations: [ApSearchPage]
})
export class ApSearchPageModule {}
