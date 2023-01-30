export interface CategoryProductsQueryModel {
    readonly categoryName: string;
    readonly products: {
        name: string;
        imageUrl: string;
        price: number;
        featureValue: number;
    }[]
}
