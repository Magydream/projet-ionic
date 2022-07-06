import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilminfoPage } from './filminfo.page';

const routes: Routes = [
  {
    path: '',
    component: FilminfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilminfoPageRoutingModule {}
