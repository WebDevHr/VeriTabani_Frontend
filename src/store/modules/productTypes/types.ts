// Define your RootState type based on your global state

export interface Product {
    product_id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    average_rating: number;
    number_of_ratings: number;
    image_url: string;
    alt_text: string;
    is_in_wishlist: boolean;
}