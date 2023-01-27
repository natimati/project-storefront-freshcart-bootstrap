import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CategoryModel } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  private _isMobileMenuVisibleSubject: Subject<boolean> = new Subject<boolean>();
  public isMobileMenuVisible$: Observable<boolean> = this._isMobileMenuVisibleSubject.asObservable();


  constructor(private _categoriesService: CategoriesService) {
  }
  handleToggle(isMobileMenuVisible: boolean) {
    this._isMobileMenuVisibleSubject.next(isMobileMenuVisible) ;
  }
}
