// store/modules/favoriteTypes/types.ts

export interface Images {
    id: number;
    imageUrl: string;
    altText: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    images: Images[]
    // Add all other product fields here
}

export interface FavoriteItem {
    id: number; // You use this as the unique key for the favorite item
    userId: number;
    productId: Product;
    // Optionally include any other properties from your response that might be useful
}