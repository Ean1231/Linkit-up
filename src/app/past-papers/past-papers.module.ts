import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PastPapersPageRoutingModule } from './past-papers-routing.module';
import { PastPapersPage } from './past-papers.page';
import { FilterModalComponent } from './filter-modal/filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastPapersPageRoutingModule
  ],
  declarations: [
    PastPapersPage,
    FilterModalComponent
  ]
})
export class PastPapersPageModule {} 