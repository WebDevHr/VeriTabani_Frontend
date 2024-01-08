<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4" v-if="product">
                <v-card class="py-10 px-2" elevation="0">
                    <!-- Main Image Carousel -->
                    <v-carousel ref="carousel" height="400" hide-delimiters show-arrows="hover" v-model="model">
                        <v-carousel-item v-for="(image, i) in product?.images" :key="i" @click="openDialog(i)">
                            <v-img :src="image.image_url" height="100%"></v-img>
                        </v-carousel-item>
                    </v-carousel>

                    <!-- Carousel Dots with Thumbnails -->
                    <div class="carousel-dots d-flex justify-center align-center mt-10">
                        <v-avatar v-for="(image, i) in product?.images" :key="`dot-${i}`" size="50"
                            class="mr-5 pa-1 clickable-avatar border rounded" v-ripple @click="model = i" rounded="0">
                            <v-img :src="image.image_url"></v-img>
                        </v-avatar>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="11" md="8" class="mx-auto" v-if="product">
                <v-card class="py-10 px-10" elevation="0">
                    <v-card-title class="pb-0">{{ product.name }}</v-card-title>
                    <v-card-text class="my-1 text-h6 pt-0 pb-3" style="color: rgb(58, 108, 244)">{{ product.description
                    }}</v-card-text>
                    <v-card-subtitle>{{ product.category }}</v-card-subtitle>
                    <v-card-text class="py-1 d-flex align-center">
                        <v-btn variant="plain" class="px-0" @click="openRatings">
                            <v-rating :model-value="product.average_rating" :readonly="true" size="small" density="compact"
                                color="grey-lighten-1" active-color="orange-darken-1" half-increments></v-rating>
                            <span class="ml-3 text-caption"> ({{ product.number_of_ratings }})</span>
                        </v-btn>
                    </v-card-text>
                    <v-card-subtitle class="mb-3">{{ product.price }} TL</v-card-subtitle>
                    <v-card-subtitle class="mb-10">Stokta {{ product.quantity_in_stock }} tane var</v-card-subtitle>
                    <v-btn class="w-75 ml-3 mr-3" elevation="1" color="my-default-color"
                        @click="addToCart(product.product_id)" :loading="loading" :disabled="loading">Sepete Ekle</v-btn>
                    <v-btn icon variant="outlined" @click="toggleFavorite(product)">
                        <v-icon color="pink">mdi-heart{{ product.is_in_wishlist ? '' : '-outline' }}</v-icon>
                    </v-btn>
                </v-card>
                <v-card class="mt-5 pa-8" elevation="0" v-if="reviews.length !== 0">
                    <v-card-title>
                        Değerlendirmeler
                    </v-card-title>
                    <div v-for="(review, index) in reviews " :key="index" class="pl-4">
                        <v-card class="my-3 pa-2" elevation="0" :border="true">
                            <v-card-subtitle>{{ review.title }}</v-card-subtitle>
                            <v-card-text> {{ review.body }}</v-card-text>
                            <v-rating class="ml-3 mb-5" :model-value="review.rating" :readonly="true" size="small"
                                density="compact" color="grey-lighten-1" active-color="orange-darken-1"
                                half-increments></v-rating>
                        </v-card>
                    </div>
                </v-card>
                <v-card v-else class="mt-5 pa-8" elevation="0">
                    <v-card-subtitle class="ml-3">Bir değerlendirme yok!</v-card-subtitle>
                </v-card>

                <v-card v-if="canAddReview" class="my-3 pa-10" elevation="0">
                    <v-form class="ml-3" @submit.prevent="addReview">
                        <v-text-field label="Başlık" v-model="review.title"></v-text-field>
                        <v-text-field label="Açıklama" v-model="review.body"></v-text-field>
                        <v-rating class="ml-3 mb-5" v-model="review.rating" size="small" density="compact"
                            color="grey-lighten-1" active-color="orange-darken-1"></v-rating>
                        <v-spacer></v-spacer>
                        <v-btn type="submit" elevation="1" color="my-default-color" :loading="reviewLoading">Yorum
                            ekle</v-btn>
                    </v-form>
                </v-card>
            </v-col>

            <v-dialog v-model="dialog" width="700" height="500" v-if="product">
                <template v-slot:default="{ isActive }">
                    <v-card>
                        <v-card-actions>
                            <v-btn color="primary" variant="text" @click="previousImage">
                                <v-icon icon="mdi-arrow-left"></v-icon>
                            </v-btn>
                            <v-btn color="primary" variant="text" @click="nextImage">
                                <v-icon icon="mdi-arrow-right"></v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon @click.stop="isActive.value = false" class="">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-actions>
                        <v-img :src="product.images[currentImage].image_url"
                            :style="!zoomed ? 'cursor: zoom-in' : 'cursor: zoom-out'" @click="zoomIn($event)"></v-img>
                    </v-card>
                </template>
            </v-dialog>

            <v-dialog v-model="ratingModal" width="700" height="500" v-if="product">
                <template v-slot:default="{ isActive }">
                    <v-card class="d-flex flex-column mx-auto py-8 pt-0" elevation="10" height="500" width="360">
                        <v-card-actions style="position: absolute; right: 0;">
                            <v-spacer></v-spacer>
                            <v-btn icon @click.stop="isActive.value = false" class="">
                                <v-icon icon="mdi-close"></v-icon>
                            </v-btn>
                        </v-card-actions>
                        <div class="d-flex align-center flex-column my-auto">
                            <div class="text-h2 mt-5">
                                {{ rating }}
                                <span class="text-h6 ml-n3">/5</span>
                            </div>

                            <v-rating :model-value="product.average_rating" color="yellow-darken-3" half-increments
                                :readonly="true"></v-rating>
                            <div class="px-3">{{ product.number_of_ratings }} değerlendirme</div>
                        </div>

                        <v-list bg-color="transparent" class="d-flex flex-column-reverse" density="compact">
                            <v-list-item v-for="(    rating, i    ) in     ratingDetails    " :key="i">
                                <v-progress-linear :model-value="rating * 20" color="yellow-darken-3" height="20"
                                    rounded></v-progress-linear>

                                <template v-slot:prepend>
                                    <span>{{ i }}</span>
                                    <v-icon icon="mdi-star" class="mx-1"></v-icon>
                                </template>

                                <template v-slot:append>
                                    <div class="rating-values">
                                        <span class="d-flex justify-end ml-5">{{ rating }} </span>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-list>

                    </v-card>
                </template>
            </v-dialog>
        </v-row>
        <!-- Comments Section Placeholder -->
        <!-- Add your comments section here -->
    </v-container>
</template>
  
<script lang="ts">
import store from '@/store';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import ProductService from '@/services/ProductService';
import { ISnackbarState } from '@/store/modules/snackbar';
import UserService2 from '@/services/UserService2';

// Define the types for the Product object structure
interface ProductImage {
    image_id: number;
    image_url: string;
    alt_text: string;
}
interface product {
    product_id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    average_rating: number;
    number_of_ratings: number;
    quantity_in_stock: number;
    images: Array<ProductImage>;
    is_in_wishlist: boolean;
}

interface review {
    title: string,
    body: string,
    rating: number,
    productId: number,
    userId: number
}

export default defineComponent({
    setup() {
        const route = useRoute();
        const router = useRouter(); // Using useRouter hook to access router instance

        const product = ref<product | null>(null);
        const model = ref(0);
        const currentImage = ref(0);
        const dialog = ref(false);
        const ratingModal = ref(false);
        const zoomed = ref(false);
        const ratingDetails = ref();
        const loading = ref(false);
        const reviewLoading = ref(false);
        const reviews = ref<review[]>([]);
        const canAddReview = ref(false);
        const review = ref({
            title: '',
            body: "",
            rating: 0,
            productId: 0,
            userId: store.state.user.activeUser ? store.state.user.activeUser.id : 0
        });

        const rating = computed(() => {
            if (product.value && typeof product.value.average_rating == 'string') {
                return parseFloat(product.value.average_rating).toFixed(1);
            }
            return 0;
        });

        onMounted(async () => {
            if (store.state.product.products.length !== 0) {
                product.value = store.state.product.products.find((item) => item.product_id.toString() === route.params.id) ?? null;
            } else {
                const response = await store.dispatch('product/fetchProductById', route.params.id);
                product.value = response.products[0]
            }
            ratingDetails.value = await ProductService.getRatingsDetails(product.value ? product.value?.product_id : 0).then((response) => {
                return response.data
            });
            reviews.value = await ProductService.getReviews(
                store.state.user.token ? store.state.user.token : '',
                product.value ? product.value?.product_id : 0
            ).then((res) => {
                return res.data.reviews
            })
            if (store.state.user.activeUser) {
                canAddReview.value = await ProductService.canAddReview(
                    product.value ? product.value?.product_id : 0,
                    store.state.user.activeUser ? store.state.user.activeUser.id : 0,
                ).then((res) => res.data.canAddReview)
            }
        });

        const openDialog = (index: number) => {
            currentImage.value = index;
            dialog.value = true;
        };

        const openRatings = () => {
            ratingModal.value = true;
        };


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const zoomIn = (event: any) => {
            const imgElement = event.target;
            if (!zoomed.value) {
                // Apply your desired zoom effect
                imgElement.style.transform = 'scale(2)';
                zoomed.value = true;
            } else {
                imgElement.style.transform = 'scale(1)';
                zoomed.value = false;
            }
        };
        const previousImage = () => {
            // Go to previous image
            if (currentImage.value > 0) {
                currentImage.value -= 1;
            }
        };
        const nextImage = () => {
            // Go to next image
            if (product.value && currentImage.value < product.value.images.length - 1) {
                currentImage.value += 1;
            }
        };

        const toggleFavorite = async (product: product) => {
            try {
                // Get JWT token from the store's state
                const token = store.state.user.token; // Ensure that your store correctly maintains the token

                if (!token) {
                    router.push({ name: 'log-in' });
                    throw new Error('Authentication token not available');
                }

                // Call the Sails.js backend to toggle the favorite status, passing the token as an argument
                // const res = await UserService.toggleProductFavorite(product.product_id, token);
                const resFavorite = await store.dispatch('favorite/toggleFavorite', product.product_id)
                // store.commit('product/TOGGLE_FAVORITE', product.product_id, { root: true })

                // Update the local product state to reflect the new favorite status
                product.is_in_wishlist = resFavorite.isFavorite; // Adapt based on the actual response structure
            } catch (error) {
                console.error('Error toggling favorite status:', error);
                // Handle errors, e.g., show an error message to the user
            }
        };

        const addReview = async () => {
            review.value.productId = product.value ? product.value?.product_id : 0;
            reviews.value.push(review.value);
            await UserService2.addReview(review.value);

        }

        const addToCart = async (productId: number) => {
            try {
                // Set the loading state for this button to true
                loading.value = true;
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
                    loading.value = false;
                }, 500)
            }
        };

        const showGlobalSnackbar = (payload: ISnackbarState) => {
            store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
        };

        return {
            product,
            rating,
            model,
            zoomed,
            dialog,
            ratingModal,
            currentImage,
            ratingDetails,
            loading,
            reviews,
            review,
            reviewLoading,
            canAddReview,
            addToCart,
            toggleFavorite,
            openDialog,
            openRatings,
            zoomIn,
            previousImage,
            nextImage,
            addReview
        };
    },
});
</script>
  
<style scoped>
.clickable-avatar:hover {
    cursor: pointer;
}
</style>
