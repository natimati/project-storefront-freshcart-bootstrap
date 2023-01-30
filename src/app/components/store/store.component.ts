import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { StoresService } from '../../services/stores.service';
import { ProductsService } from '../../services/products.service';
import { StoreWithPorductsQueryModel } from 'src/app/query-models/store-with-porducts.query-model';
import { StoreProductsQueryModel } from 'src/app/query-models/store-products.query-model';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreComponent {
  readonly search: FormGroup = new FormGroup({ product: new FormControl() });
  readonly currentStoreId$: Observable<string> = this._activatedRoute.params.pipe(
    map(params => params['storeId'].toString())
  );

  readonly storeWithProducts$: Observable<StoreWithPorductsQueryModel> = combineLatest([
    this.currentStoreId$.pipe(
      switchMap(
        currStoreId => this._storesService.getStoreById(currStoreId.toString())
      )
    ),
    this._productsService.getAllProducts()
  ]).pipe(
    map(([store, products]) => ({
      name: store.name,
      id: store.id,
      logoUrl: store.logoUrl,
      distance: Math.round(store.distanceInMeters / 100) / 10,
      products: products.filter(product => product.storeIds.includes(store.id))
    }))
  )

  readonly foundedProducts: Observable<StoreProductsQueryModel[] | undefined> = combineLatest([
    this.search.valueChanges,
    this.storeWithProducts$
  ]).pipe(
    map(([searchValue, store]) => {
      const filterValue = searchValue.product || '';
      return store.products.filter(product => product.name.toLowerCase().includes(filterValue.toLowerCase()))
    })
  );

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _storesService: StoresService,
    private _productsService: ProductsService) {}
}
