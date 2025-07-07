import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificationDebugPageRoutingModule } from './notification-debug-routing.module';
import { NotificationDebugPage } from './notification-debug.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationDebugPageRoutingModule
  ],
  declarations: [NotificationDebugPage]
})
export class NotificationDebugPageModule {} 