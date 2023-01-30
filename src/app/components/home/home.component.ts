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

  readonly fruitsCategoryProducts$: Observable<CategoryProductsQueryModel | undefined> = combineLatest([
    this.categoriesList$,
    this.productsList$
  ]).pipe(map(([categories, products]) => {
    const fruitsCategory = categories.find(category => category.name === 'Fruits & Vegetables');
    return this.resolveCategoryData(products, fruitsCategory)
  }));

  readonly snacksCategoryProducts$: Observable<CategoryProductsQueryModel | undefined> = combineLatest([
    this.categoriesList$,
    this.productsList$
  ]).pipe(map(([categories, products]) => {
    const snacksCategory = categories.find(category => category.name === 'Snack & Munchies');
    return this.resolveCategoryData(products, snacksCategory)
  }));

  constructor(private _categoriesService: CategoriesService, private _storesService: StoresService, private _productsService: ProductsService) {
  }

  convertDistance(distance: number): number {
    return Math.round(distance / 100 )/10
  };

  resolveCategoryData(allProducts: ProductModel[], category?: CategoryModel): CategoryProductsQueryModel | undefined {
    if (!category) { return }

    const categoryProducts = allProducts.reduce((acc: CategoryProductsQueryModel['products'], product) => {
      if (product.categoryId === category.id) {
        acc.push(product)
      }
      return acc
    }, [] )
    const sortedCategoryProducts = categoryProducts.sort((a, b) => {
      return b.featureValue - a.featureValue
    }).slice(0, 5)
    return {
      categoryName: category.name,
      products: sortedCategoryProducts
    }
  };
}