import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { StoreComponent } from './components/store/store.component';
import { HomeComponentModule } from './components/home/home.component-module';
import { CategoryProductsComponentModule } from './components/category-products/category-products.component-module';
import { StoreComponentModule } from './components/store/store.component-module';

const routes: Routes = [{
  path: '', component: HomeComponent
}, {
    path: 'categories/:categoryId', component: CategoryProductsComponent
  }, {
    path: 'stores/:storeId', component: StoreComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeComponentModule, CategoryProductsComponentModule, StoreComponentModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
