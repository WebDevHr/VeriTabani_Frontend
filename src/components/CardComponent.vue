<template>
    <v-container>
        <v-row>
            <v-col v-for="product in products" :key="product.product_id">
                <v-card width="250" class="py-4" @click="goToProductDetails(product.product_id)">
                    <!-- Product Image -->
                    <v-img :src="product.image_url" height="200px" class="white--text align-end rounded "
                        position="relative">
                        <!-- Favorite Icon Button -->
                        <v-btn icon class="float-right fav-btn" variant="text"
                            @click.stop.prevent="toggleFavorite(product)">
                            <!-- @click.stop="toggleFavorite(product)" -->
                            <v-icon color="indigo">mdi-heart{{ product.is_in_wishlist ? '' : '-outline' }}</v-icon>
                            <!-- {{ product.is_favorite ? '' : '-outline' }} -->
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
                    <v-card-actions>
                        <v-btn class="w-100" color="my-default-color" variant="elevated" hover
                            :disabled="loadingStates[product.product_id]"
                            @click.stop.prevent="addToCart(product.product_id)"
                            :loading="loadingStates[product.product_id]">
                            <!-- <v-progress-circular indeterminate color="primary" size="14" class="mr-2"
                                v-if="loadingStates[product.product_id]" /> -->
                            Sepete Ekle
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductService from '@/services/ProductService';
import store from '@/store';
import { ISnackbarState } from '@/store/modules/snackbar';
import UserService from '@/services/UserService';

interface product {
    product_id: number,
    name: string,
    category: string,
    description: string,
    price: number,
    average_rating: number,
    number_of_ratings: number,
    image_url: string,
    alt_text: string,
    is_in_wishlist: boolean
}

export default {
    setup() {
        // Creating a reactive state for products using ref
        const products = ref();
        const perPage = ref(4);
        const page = ref(1);
        const router = useRouter(); // Using useRouter hook to access router instance
        const userId = ref();
        const loadingStates = ref<{ [key: number]: boolean }>({});

        // onMounted(() => {
        //     const res = store.dispatch('product/fetchProducts', { userId: 0, perPage: 4, page: 1 })

        // })

        // Fetch products from the ProductService when component is mounted
        const fetchProducts = async () => {
            try {
                // Assuming getProducts returns a Promise containing an array of products
                if (!store.state.user.activeUser || !store.state.user.activeUser.id) {
                    userId.value = 0;
                } else {
                    userId.value = store.state.user.activeUser.id
                }
                const response = await ProductService.getProducts(userId.value, perPage.value, page.value);
                products.value = response.data.products; // Set the products data with the response
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Handle the error or show an error message to the user
            }
        };

        onMounted(fetchProducts);  // Fetch products after component has been mounted

        // Methods are now just regular functions defined in the setup.
        const toggleFavorite = async (product: product) => {
            try {
                // Get JWT token from the store's state
                const token = store.state.user.token; // Ensure that your store correctly maintains the token

                if (!token) {
                    router.push({ name: 'log-in' });
                    throw new Error('Authentication token not available');
                }

                // Call the Sails.js backend to toggle the favorite status, passing the token as an argument
                const res = await UserService.toggleProductFavorite(product.product_id, token);

                // Update the local product state to reflect the new favorite status
                product.is_in_wishlist = res.data.isFavorite; // Adapt based on the actual response structure
            } catch (error) {
                console.error('Error toggling favorite status:', error);
                // Handle errors, e.g., show an error message to the user
            }
        };

        const addToCart = async (productId: number) => {
            if (!loadingStates.value[productId]) {
                try {
                    // Set the loading state for this button to true
                    loadingStates.value[productId] = true;
                    const token = store.state.user.token;
                    if (!token) {
                        router.push({ name: 'log-in' });
                        throw new Error('Authentication token not found.');
                    }

                    // Dispatch action to add product to cart
                    await store.dispatch('cart/addItemToCart', {
                        productId,
                        token
                    })

                    // Optional: show a success message
                    showGlobalSnackbar({
                        show: true,
                        color: 'green-darken-3',
                        text: 'Ürün sepetinize eklendi!',
                        timeout: 3000,
                    });

                } catch (error) {
                    console.error('There was an error adding the product to cart:', error);
                    showGlobalSnackbar({
                        show: true,
                        color: 'red-darken-3',
                        text: 'Hata! ' + error,
                        timeout: 3000,
                    });
                    // Optional: show an error message
                }
                finally {
                    setTimeout(() => {
                        loadingStates.value[productId] = false;
                    }, 500)
                }
            }
        };

        // Method to dispatch action for toggling favorite


        const goToProductDetails = (productId: number) => {
            router.push({ name: 'product-details', params: { id: productId } });
        };

        const showGlobalSnackbar = (payload: ISnackbarState) => {
            store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
        };

        // Return everything that should be accessible in the template
        return {
            products,
            loadingStates,
            toggleFavorite,
            goToProductDetails,
            addToCart,
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