import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilminfoPageRoutingModule } from './filminfo-routing.module';

import { FilminfoPage } from './filminfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilminfoPageRoutingModule
  ],
  declarations: [FilminfoPage]
})
export class FilminfoPageModule {}
