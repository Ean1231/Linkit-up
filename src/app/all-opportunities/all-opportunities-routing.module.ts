import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllOpportunitiesPage } from './all-opportunities.page';

const routes: Routes = [
  {
    path: '',
    component: AllOpportunitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllOpportunitiesPageRoutingModule {}
