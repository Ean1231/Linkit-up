import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PastPapersPage } from './past-papers.page';

const routes: Routes = [
  {
    path: '',
    component: PastPapersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PastPapersPageRoutingModule {} 