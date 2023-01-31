import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, switchMap } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';
import { ProductsByCategoryQueryModel } from 'src/app/query-models/products-by-category.query-model';
import { ProductsService } from 'src/app/services/products.service';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories().pipe(shareReplay(1));
  readonly currentCategoryId$: Observable<string> = this._activatedRoute.params.pipe(
    map(params => params['categoryId'].toString())
  );

  readonly productsByCategory$: Observable<ProductsByCategoryQueryModel> = combineLatest([
    this.currentCategoryId$.pipe(
      switchMap(id => this._categoriesService.getCategoryById(id))
    ),
    this._productService.getAllProducts()
  ]).pipe(map(([currCategory, products]) => {
    const categoryProducts = products.filter(product => product.categoryId === currCategory.id);
    const productsByCategory = {
      categoryName: currCategory.name,
      categoryId: currCategory.id,
      productCount: categoryProducts.length,
      products: categoryProducts.map(product => ({
        name: product.name,
        ratingCount: product.ratingCount,
        ratingValue: product.ratingValue,
        ratingMark: this.starsCounter(product.ratingValue),
        price: product.price,
        imageUrl: product.imageUrl
      }))
    }
    return productsByCategory;
  }));
  
  readonly categoryProducts$: Observable<ProductModel[]> = combineLatest([
    this.currentCategoryId$,
    this._productService.getAllProducts()
  ]).pipe(map(([id, products]) => {
    return products.filter(product => product.categoryId === id)
  }));  

  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductsService
  ) {
  };

  starsCounter(ratingValue: number): number[] {
    const stars = [0, 0, 0, 0, 0];
    for (let i = 1; ratingValue >= i; i++){
      stars[i-1] = 1
    }
    if (ratingValue % 1 !== 0) {
      const index = stars.indexOf(0);
      stars[index] = 0.5
    }
    return stars
};
 
}
