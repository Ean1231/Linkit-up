import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccomodationDetailsPage } from './accomodation-details.page';

const routes: Routes = [
  {
    path: '',
    component: AccomodationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccomodationDetailsPageRoutingModule {}
