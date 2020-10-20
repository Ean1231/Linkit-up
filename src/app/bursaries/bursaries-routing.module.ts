import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BursariesPage } from './bursaries.page';

const routes: Routes = [
  {
    path: '',
    component: BursariesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BursariesPageRoutingModule {}
