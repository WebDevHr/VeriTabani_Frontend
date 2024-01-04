<template>
    <v-container>
        <v-row justify="center">
            <v-col v-if="computedCartItems && computedCartItems[0]">
                <v-card class="mx-auto" outlined :loading="cartLoading">
                    <v-list variant="flat">
                        <v-list-item>
                            <v-list-item-title>Sepetim ({{ cartItemsCount }} Ürün)</v-list-item-title>
                        </v-list-item>
                        <v-divider></v-divider>

                        <!-- Cart Items List -->

                        <v-list-item v-for="item in computedCartItems" :key="item.cart_item_id">
                            <div class="d-flex pa-5">
                                <div class="me-5">
                                    <v-img height="64" width="72" :src="getItemImageUrl(item)"></v-img>
                                </div>
                                <div class="me-5 title-style">
                                    <v-list-item-title tag="span">{{ item.productId.name }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ item.productId.description }}</v-list-item-subtitle>
                                </div>
                                <v-spacer></v-spacer>
                                <div class="d-flex align-center">
                                    <v-list-item-action>
                                        <v-btn icon @click="minusQuantity(item.cart_item_id, item.product_id)"
                                            size="x-small" elevation="1" color="my-default-color">
                                            <v-icon :size="item.quantity < 2 ? 'x-large' : 'small'"
                                                :icon="item.quantity < 2 ? 'mdi-delete-forever' : 'mdi-minus-thick'">
                                            </v-icon>
                                        </v-btn>
                                        <v-list-item-title class="border rounded px-3 mx-2 text-button">
                                            {{ item.quantity }}
                                        </v-list-item-title>
                                        <v-btn icon @click="plusQuantity(item.cart_item_id, item.product_id)" size="x-small"
                                            elevation="1" color="my-default-color">
                                            <v-icon size="small" icon="mdi-plus-thick"></v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </div>
                                <div class="d-flex align-center ms-5">
                                    <v-list-item-subtitle>{{ (parseFloat(item.productId.price) *
                                        item.quantity).toFixed(2) }}
                                        TL
                                    </v-list-item-subtitle>
                                </div>
                            </div>
                            <v-divider></v-divider>
                        </v-list-item>

                        <!-- Cart Summary -->
                        <v-list-item class="d-flex justify-end">
                            <v-list-item-title>Toplam: {{ totalPrice.toFixed(2) }} TL</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
                <div class="d-flex justify-end mt-3">
                    <v-btn color="my-default-color" :to="{ name: 'take-order' }">Sepeti
                        tamamla</v-btn>
                </div>
            </v-col>
            <v-col v-else>
                <v-card class="pa-10 mt-5">
                    <v-card-title class="d-flex justify-center">
                        Sepetinde birşey yok!
                    </v-card-title>
                    <v-card-subtitle class="d-flex justify-center align-center">
                        Ürünler eklemek için,
                        <v-btn :to="{ name: 'home' }" class="px-2" append-icon="mdi-home" variant="plain"
                            color="blue">Anasayfa</v-btn>
                        geç
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';


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


export default defineComponent({
    name: 'CartView',
    setup() {
        const store = useStore();
        const router = useRouter();
        const cartItems = ref<CartItem[]>([]);
        const cartLoading = ref(false);

        // Fetch items on mounted
        onMounted(async () => {
            if (!store.state.user.token) {
                router.push({ name: 'log-in' });
            }
            else {
                cartLoading.value = true;
                try {
                    const token = store.state.user.token// Or use a store if you're using Vuex/Pinia
                    if (!token) {
                        router.push({ name: 'log-in' });
                        throw new Error('Authentication token not found.');
                    }

                    const response = await store.dispatch('cart/fetchCartItems');
                    if (response.length !== 0) {
                        cartItems.value = response;
                    }

                } catch (error) {
                    console.error('There was an error fetching the cart items:', error);
                    // Emit an error or show a notification as per your error-handling strategy
                } finally {
                    cartLoading.value = false;
                }
            }
        });

        // Compute total price
        const totalPrice = computed(() => {
            if (cartItems.value && cartItems.value[0])
                return cartItems.value.reduce((total, item) => {
                    return total + (item.quantity * parseFloat(item.productId.price));
                }, 0);
            else
                return 0;
        });

        const computedCartItems = computed(() => {
            return cartItems.value.filter((item) => item.quantity > 0)
        })

        const cartItemsCount = computed(() => {
            return cartItems.value.reduce((total, item) => {
                return total + (item.quantity);
            }, 0);
        })

        // (parseFloat(item.productId.price) *  item.quantity).toFixed(2)

        // Methods
        const getItemImageUrl = (item: CartItem) => {
            return item.productId.images.length > 0 ? item.productId.images[0].imageUrl : 'https://via.placeholder.com/125';
        };

        const minusQuantity = async (cartItemId: number, product_id: number) => {
            await store.dispatch('cart/removeItemFromCart', { cartItemId: cartItemId, productId: product_id });
        };

        const plusQuantity = async (cartItemId: number, product_id: number) => {
            await store.dispatch('cart/addItemToCart', { cartItemId: cartItemId, productId: product_id });
        };

        return {
            cartItems,
            totalPrice,
            cartLoading,
            computedCartItems,
            cartItemsCount,
            getItemImageUrl,
            minusQuantity,
            plusQuantity
        };
    }
});
</script>
  
  <!-- Styles scoped to this component -->
<style scoped>
.title-height {
    height: 80px;
}
</style>