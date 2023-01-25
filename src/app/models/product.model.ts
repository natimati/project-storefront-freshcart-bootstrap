export interface ProductModel {
  readonly categoryId: string;
  readonly featureValue: number;
  readonly id: string;
  readonly imageUrl: string;
  readonly name: string;
  readonly ratingCount: number;
  readonly ratingValue: number;
  readonly storeIds: string[];
}
