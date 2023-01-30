import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, of, shareReplay, switchMap } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { ProductsByCategoryQueryModel } from '../../query-models/products-by-category.query-model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {
  private _orderSubject: BehaviorSubject<string> = new BehaviorSubject<string>('featured');
  public order$: Observable<string> = this._orderSubject.asObservable();

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories().pipe(shareReplay(1));
  readonly currentCategoryId$: Observable<string> = this._activatedRoute.params.pipe(
    map(params => params['categoryId'].toString())
  );

  readonly productsByCategory$: Observable<ProductsByCategoryQueryModel> = combineLatest([
    this.currentCategoryId$.pipe(
      switchMap(id => this._categoriesService.getCategoryById(id))
    ),
    this._productService.getAllProducts(),
    this.order$
  ]).pipe(map(([currCategory, products, order]) => {
    const categoryProducts = products.filter(product => product.categoryId === currCategory.id);
    const productsByCategory = {
      categoryName: currCategory.name,
      categoryId: currCategory.id,
      productCount: categoryProducts.length,
      products: categoryProducts.map(product => ({
        name: product.name,
        featureValue: product.featureValue,
        ratingCount: product.ratingCount,
        ratingValue: product.ratingValue,
        ratingMark: this.starsCounter(product.ratingValue),
        price: product.price,
        imageUrl: product.imageUrl
      })).sort((a, b) => {
        if (order === 'featured') {
          return b.featureValue - a.featureValue
        }
        if (order === 'rating') {
          return b.ratingValue - a.ratingValue
        }
        if (order === 'price-asc') {
          return a.price - b.price
        }
        if (order === 'price-desc') {
          return b.price - a.price
        }
        return 0
      })
    }
    return productsByCategory
  }));

  public orders: Observable<{ id: string, name: string }[]> = of([
    { id: 'featured', name: "Featured" },
    { id: 'price-asc', name: "Price: Low to High" },
    { id: 'price-desc', name: 'Price: High to Low' },
    { id: 'rating', name: 'Avg. Rating' }
  ])

  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductsService
  ) {
  };

  starsCounter(ratingValue: number): number[] {
    const stars = [0, 0, 0, 0, 0];
    for (let i = 1; ratingValue >= i; i++) {
      stars[i - 1] = 1
    }
    if (ratingValue % 1 !== 0) {
      const index = stars.indexOf(0);
      stars[index] = 0.5
    }
    return stars
  };

  sort(value: string) {
    console.log(value)
    return this._orderSubject.next(value)   
  }

}
