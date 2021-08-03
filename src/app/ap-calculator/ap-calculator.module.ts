import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApCalculatorPageRoutingModule } from './ap-calculator-routing.module';

import { ApCalculatorPage } from './ap-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApCalculatorPageRoutingModule
  ],
  declarations: [ApCalculatorPage]
})
export class ApCalculatorPageModule {}
