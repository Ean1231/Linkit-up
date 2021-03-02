import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApScorePageRoutingModule } from './ap-score-routing.module';

import { ApScorePage } from './ap-score.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApScorePageRoutingModule
  ],
  declarations: [ApScorePage]
})
export class ApScorePageModule {}
