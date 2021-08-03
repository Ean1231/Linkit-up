import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApCalculatorPage } from './ap-calculator.page';

const routes: Routes = [
  {
    path: '',
    component: ApCalculatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApCalculatorPageRoutingModule {}
