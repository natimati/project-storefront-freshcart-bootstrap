import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest, map, of, shareReplay, switchMap, take, tap, startWith } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { ProductsInCategoryQueryModel } from '../../query-models/products-in-category.query-model';
import { ProductsByCategoryQueryModel } from '../../query-models/products-by-category.query-model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent implements AfterViewInit {
  readonly paginationForm = new FormGroup({
    limit: new FormControl(),
    page: new FormControl()
  });

  private _priceFromSubject: Subject<number> = new Subject<number>();
  public priceFrom$: Observable<number> = this._priceFromSubject.asObservable().pipe(startWith(0));

  private _priceToSubject: Subject<number> = new Subject<number>();
  public priceTo$: Observable<number> = this._priceToSubject.asObservable().pipe(startWith(0));

  private _ratingSubject: Subject<number> = new Subject<number>();
  public rating$: Observable<number> = this._ratingSubject.asObservable().pipe(startWith(0));

  private _orderSubject: BehaviorSubject<string> = new BehaviorSubject<string>('featured');
  public order$: Observable<string> = this._orderSubject.asObservable();
  readonly limitOptions$: Observable<number[]> = of([5, 10, 15]);
  // added 1 start to show products with rating >=1 and <2
  public ratingOptions$: Observable<number[]> = of([5, 4, 3, 2, 1]);

  readonly currentLimit$: Observable<number> = this._activatedRoute.queryParams.pipe(
    map(params => params['limit'] ? +params['limit'] : 5), shareReplay(1)
  );
  readonly currentPage$: Observable<number> = this._activatedRoute.queryParams.pipe(
    map(params => params['page'] ? +params['page'] : 1), shareReplay(1)
  );

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories().pipe(shareReplay(1));
  readonly currentCategoryId$: Observable<string> = this._activatedRoute.params.pipe(
    map(params => params['categoryId'].toString()), shareReplay(1)
  );

  readonly products$: Observable<ProductsInCategoryQueryModel[]> = combineLatest([
    this.currentCategoryId$,
    this._productService.getAllProducts(),
  ]).pipe(map(([id, products]) => {
    const categoryProducts = products.filter(product => product.categoryId === id);
    return categoryProducts.map(product => (
      {
        name: product.name,
        featureValue: product.featureValue,
        ratingCount: product.ratingCount,
        ratingValue: product.ratingValue,
        ratingMark: this.starsCounter(product.ratingValue),
        price: product.price,
        imageUrl: product.imageUrl,
      }
    ))
  }), shareReplay(1))

  readonly productsByCategory$: Observable<ProductsByCategoryQueryModel> = combineLatest([
    this.currentCategoryId$.pipe(
      switchMap(id => this._categoriesService.getCategoryById(id))
    ),
    this.products$,
    this.order$,
    this.currentLimit$,
    this.currentPage$,
    this.priceFrom$,
    this.priceTo$,
    this.rating$
  ]).pipe(map(([currCategory, products, order, limit, page, from, to, rating]) => {
    const filteredProducts = products.sort((a, b) => {
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
      .filter(product => {
        return this.filterByPrice(product.price, from, to) && this.filterByRating(product.ratingValue, rating)
      });
    const productsByCategory = {
      categoryName: currCategory.name,
      categoryId: currCategory.id,
      productCount: filteredProducts.length,
      products: filteredProducts.slice((page - 1) * limit, page * limit)
    }
    return productsByCategory;
  }));

  readonly pages$: Observable<number[]> = combineLatest([
    this.currentCategoryId$,
    this.productsByCategory$,
    this.currentLimit$,
  ]).pipe(map(([id, category, limit]) => {
    const result: number[] = [];
    for (let i = 1; i <= Math.ceil(category.productCount / limit); i++) {
      result.push(i)
    }
    return result
  }));

  public orders$: Observable<{ id: string, name: string }[]> = of([
    { id: 'featured', name: "Featured" },
    { id: 'price-asc', name: "Price: Low to High" },
    { id: 'price-desc', name: 'Price: High to Low' },
    { id: 'rating', name: 'Avg. Rating' }
  ]);


  constructor(
    private _categoriesService: CategoriesService,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductsService,
    private _router: Router
  ) {
  };

  ngAfterViewInit() {
    this.paginationForm.valueChanges.pipe(tap(formValues => this._router.navigate([], {
      queryParams: {
        limit: formValues.limit,
        page: formValues.page
      }
    }))).subscribe()
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
    return this._orderSubject.next(value)
  };
  onLimitChange(limit: number): void {
    combineLatest([
      this.productsByCategory$,
      this.currentPage$
    ]).pipe(take(1),
      tap(([category, page]) => {
        return this._router.navigate([], {
          queryParams: {
            page: (page > Math.ceil(category.productCount / limit)) ? Math.ceil(category.productCount / limit) : page,
            limit: limit
          }
        })
      })).subscribe();

  };
  onPageChange(page: number): void {
    this.currentLimit$.pipe(take(1),
      tap(limit => {
        return this._router.navigate([], {
          queryParams: {
            page: page,
            limit
          }
        })
      })).subscribe();
  };

  onFromChange(value: string) {
    this._priceFromSubject.next(+value)
  };

  onToChange(value: string) {
    this._priceToSubject.next(+value)
  };

  onRatingChange(item: number) {
    this._ratingSubject.next(item)
  }

  filterByRating(productRate: number, selectedRating: number) {
    if (selectedRating) {
      return (productRate >= selectedRating)
    } return true
  };

  filterByPrice(price: number, from: number, to: number) {
    if (from && to) {
      return price <= from && price <= to
    }
    if (from) {
      return price >= from
    }
    if (to) {
      return price <= to
    }
    return true
  }
}
