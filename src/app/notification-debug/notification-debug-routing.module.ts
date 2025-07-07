import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationDebugPage } from './notification-debug.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationDebugPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationDebugPageRoutingModule {} 