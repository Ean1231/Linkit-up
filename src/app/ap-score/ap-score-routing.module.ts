import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApScorePage } from './ap-score.page';

const routes: Routes = [
  {
    path: '',
    component: ApScorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApScorePageRoutingModule {}
