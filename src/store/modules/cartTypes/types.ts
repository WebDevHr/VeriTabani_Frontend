interface ProductImage {
    createdAt: number;
    updatedAt: number;
    id: number;
    imageUrl: string;
    altText: string;
    productId: number;
}

interface Product {
    images: ProductImage[];
    createdAt: number;
    updatedAt: number;
    id: number;
    name: string;
    description: string;
    price: string;
    quantityInStock: number;
    categoryId: number;
}

interface CartItem {
    cart_id: number;
    user_id: number;
    cart_item_id: number;
    product_id: number;
    quantity: number;
    productId: Product;
}

// Assuming you have a separate file for types, e.g., types.ts
export type { CartItem, ProductImage, Product };