import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContextComponent } from './component/context/context.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/process/context', pathMatch: 'full' },
  {
    path: 'context', component: ContextComponent, children: [
      { path: '', redirectTo: '/process/context/home', pathMatch: 'full' },
      { path: 'home', component: HomepageComponent },
      {
        path: 'product-overview/:id',
        loadComponent: () => import('./component/product-overview/product-overview.component').then(c => c.ProductOverviewComponent)
      },
      {
        path: 'wishlist',
        canActivate: [authGuard],
        loadComponent: () => import('./component/wishlist/wishlist.component').then(c => c.WishlistComponent)
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./component/cart/cart.component').then(c => c.CartComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule {
}
