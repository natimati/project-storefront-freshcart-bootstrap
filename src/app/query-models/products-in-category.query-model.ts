export interface ProductsInCategoryQueryModel {
    readonly name: string;
    readonly featureValue: number;
    readonly ratingCount: number;
    readonly ratingValue: number;
    readonly ratingMark: number[];
    readonly price: number;
    readonly imageUrl: string
}
