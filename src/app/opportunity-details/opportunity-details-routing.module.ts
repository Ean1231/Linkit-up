import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpportunityDetailsPage } from './opportunity-details.page';

const routes: Routes = [
  {
    path: '',
    component: OpportunityDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpportunityDetailsPageRoutingModule {}
