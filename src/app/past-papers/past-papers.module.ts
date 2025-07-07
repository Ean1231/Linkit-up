import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PastPapersPageRoutingModule } from './past-papers-routing.module';
import { PastPapersPage } from './past-papers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PastPapersPageRoutingModule
  ],
  declarations: [PastPapersPage]
})
export class PastPapersPageModule {} 