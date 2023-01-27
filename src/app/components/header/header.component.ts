import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() categoriesList!: CategoryModel[] | null;
  private _isMobileMenuVisibleSubject: Subject<boolean> = new Subject<boolean>();
  public isMobileMenuVisible$: Observable<boolean> = this._isMobileMenuVisibleSubject.asObservable();


  constructor() {
  }
  handleToggle(isMobileMenuVisible: boolean) {
    this._isMobileMenuVisibleSubject.next(isMobileMenuVisible) ;
  }
}
