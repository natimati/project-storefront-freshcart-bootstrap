export interface ProductsByCategoryQueryModel {
  readonly categoryName: string;
  readonly categoryId: string;
  readonly productCount: number;
  readonly products: {
    name: string;
    featureValue: number;
    ratingCount: number;
    ratingValue: number;
    ratingMark: number[];
    price: number;
    imageUrl: string
  }[];
}
