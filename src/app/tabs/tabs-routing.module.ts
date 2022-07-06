import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'gallery',
        loadChildren: () => import('../gallery/gallery.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'film',
        loadChildren: () => import('../films/film.module').then(m => m.Tab3PageModule)
      },
    ]
  },
  {
    path:'tabs/film/:id',
    loadChildren:()=> import('../filminfo/filminfo.module').then(m => m.FilminfoPageModule)

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
