import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { combineLatest, Observable, map, shareReplay } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { CategoryProductsQueryModel } from 'src/app/query-models/category-products.query-model';
import { ProductsService } from 'src/app/services/products.service';
import { CategoryModel } from '../../models/category.model';
import { StoreModel } from '../../models/store.model';
import { CategoriesService } from '../../services/categories.service';
import { StoresService } from '../../services/stores.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories().pipe(shareReplay(1));
  readonly storesList$: Observable<StoreModel[]> = this._storesService.getAllStores();
  readonly productsList$: Observable<ProductModel[]> = this._productsService.getAllProducts();

  readonly categoriesProducts$: Observable<CategoryProductsQueryModel[]> = combineLatest([
    this.categoriesList$,
    this.productsList$
  ]).pipe(map(([categories, products]) => {
    const fruitsCategory = categories.find(category => category.name === 'Fruits & Vegetables');
    const snacksCategory = categories.find(category => category.name === 'Snack & Munchies');
    const categoriesProducts = products.reduce((acc: CategoryProductsQueryModel[], product) => {
      if (fruitsCategory && product.categoryId === fruitsCategory.id) {
        acc[0].products.push(product)
      } else if (snacksCategory && product.categoryId === snacksCategory.id) {
        acc[1].products.push(product)
      }
      return acc
    }, [{ categoryName: 'Fruits & Vegetables', products: [] }, { categoryName: 'Snack & Munchies', products: [] }]) 
    return categoriesProducts.map(category => ({
      categoryName: category.categoryName,
      products: category.products.sort((a, b) => {
        return b.featureValue - a.featureValue
      }).slice(0,5)
    }
    ))
  }))

  constructor(private _categoriesService: CategoriesService, private _storesService: StoresService, private _productsService: ProductsService) {
  }

  convertDistance(distance: number): number {
    return Math.round(distance / 100 )/10
  }
}
