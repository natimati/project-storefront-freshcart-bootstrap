import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';
import { StoreModel } from 'src/app/models/store.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  readonly storesList$: Observable<StoreModel[]> = this._storesService.getAllStores();
  readonly getToKnowUsList$: Observable<string[]> = of(['Company', 'About', 'Blog', 'Help Center', 'Our Value'])

  constructor(private _categoriesService: CategoriesService, private _storesService: StoresService) {
  }
}
