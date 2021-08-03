import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApSearchPage } from './ap-search.page';

const routes: Routes = [
  {
    path: '',
    component: ApSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApSearchPageRoutingModule {}
