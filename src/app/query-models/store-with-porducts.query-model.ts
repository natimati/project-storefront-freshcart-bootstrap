import { StoreProductsQueryModel } from "./store-products.query-model";

export interface StoreWithPorductsQueryModel {
  readonly name: string;
  readonly id: string;
  readonly logoUrl: string;
  readonly distance: number;
  readonly products: StoreProductsQueryModel[];
}
