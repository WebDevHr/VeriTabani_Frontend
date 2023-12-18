<template>
    <v-container>
        <v-row>
            <v-col v-for="product in products" :key="product.product_id">
                <v-card width="250" class="py-4" @click="goToProductDetails(product.product_id)">
                    <!-- Product Image -->
                    <v-img :src="product.image_url" height="200px" class="white--text align-end" position="relative">
                        <!-- Favorite Icon Button -->
                        <v-btn icon class="float-right fav-btn" variant="text">
                            <!-- @click.stop="toggleFavorite(product)" -->
                            <v-icon color="pink">mdi-heart-outline</v-icon>
                            <!-- {{ product.isFavorite ? '' : '-outline' }} -->
                        </v-btn>
                    </v-img>

                    <v-card-title>{{ product.name }}</v-card-title>
                    <v-card-subtitle>{{ product.category }}</v-card-subtitle>
                    <v-card-subtitle class="my-1">{{ product.description }}</v-card-subtitle>
                    <v-card-text class="py-1 d-flex align-center">
                        <v-rating :model-value="product.average_rating" :readonly="true" size="small" density="compact"
                            color="grey-lighten-1" active-color="orange-darken-1" half-increments></v-rating>
                        <span class="ml-3 text-caption"> ({{ product.number_of_ratings }})</span>
                    </v-card-text>
                    <v-card-subtitle>{{ product.price }} TL</v-card-subtitle>

                </v-card>
            </v-col>
            {{ test }}
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductService from '@/services/ProductService';

// interface product {
//     product_id: number,
//     name: string,
//     category: string,
//     description: string,
//     price: number,
//     average_rating: number,
//     number_of_ratings: number,
//     image_url: string,
//     alt_text: string
// }

export default {
    setup() {
        // Creating a reactive state for products using ref
        const products = ref([
            {
                product_id: 1,
                name: 'Product 1',
                category: 'Category 1',
                description: 'This is a description for Product 1.',
                price: 19.99,
                average_rating: 4.6,
                number_of_ratings: 120,
                image_url: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
                alt_text: 'fsdfsdf'
            },
            // ... other products
        ]);
        const perPage = ref(4);
        const page = ref(1)
        const test = ref()

        // Fetch products from the ProductService when component is mounted
        const fetchProducts = async () => {
            try {
                // Assuming getProducts returns a Promise containing an array of products
                const response = await ProductService.getProducts(perPage.value, page.value);
                products.value = response.data.products; // Set the products data with the response
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Handle the error or show an error message to the user
            }
        };

        onMounted(fetchProducts);  // Fetch products after component has been mounted

        // Methods are now just regular functions defined in the setup.
        // const toggleFavorite = (product: product) => {
        //     product.isFavorite = !product.isFavorite;
        // };

        const router = useRouter(); // Using useRouter hook to access router instance
        const goToProductDetails = (productId: number) => {
            router.push({ name: 'product-details', params: { id: productId } });
        };

        // Return everything that should be accessible in the template
        return {
            products,
            // toggleFavorite,
            goToProductDetails,
            test
        };
    },
};
</script>

<style scoped>
.fav-btn {
    position: absolute;
    top: 0px;
    right: 5px;
    background-color: transparent;
    box-shadow: none;
}
</style>