import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  readonly currentCategoryId$: Observable<string> = this._activatedRoute.params.pipe(
    map(params => params['categoryId'].toString())
  );
  readonly currentCategory$: Observable<CategoryModel> = this.currentCategoryId$.pipe(
    switchMap(id => this._categoriesService.getCategoryById(id))
  )

  constructor(private _categoriesService: CategoriesService, private _activatedRoute: ActivatedRoute) {
  }
}
