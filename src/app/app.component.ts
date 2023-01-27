import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from './models/category.model';
import { CategoriesService } from './services/categories.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-freshcard-bootstrap-theme';
  readonly categoriesList$: Observable<CategoryModel[]> = this._categoriesService.getAllCategories();
  

  constructor(private _categoriesService: CategoriesService) {
  }
}
