import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';
import { StoreModel } from 'src/app/models/store.model';
import { StoresService } from 'src/app/services/stores.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  @Input() categoriesList!: CategoryModel[] | null;
  readonly storesList$: Observable<StoreModel[]> = this._storesService.getAllStores();
  readonly getToKnowUsList$: Observable<string[]> = of(['Company', 'About', 'Blog', 'Help Center', 'Our Value'])

  constructor(private _storesService: StoresService) {
  }
}
