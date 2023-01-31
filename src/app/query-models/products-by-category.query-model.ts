import { ProductsInCategoryQueryModel } from "./products-in-category.query-model";

export interface ProductsByCategoryQueryModel {
  readonly categoryName: string;
  readonly categoryId: string;
  readonly productCount: number;
  readonly products: ProductsInCategoryQueryModel[];
}
