<template>
    <v-card width="250" class="py-4" @click="$emit('view-details', product.product_id)">
        <v-img :src="product.images[0]?.image_url" height="200px" class="white--text align-end rounded" position="relative">
            <v-btn icon class="float-right fav-btn" variant="text" @click.stop.prevent="toggleFavorite">
                <v-icon color="pink">mdi-heart{{ product.is_in_wishlist ? '' : '-outline' }}</v-icon>
            </v-btn>
        </v-img>

        <v-card-text class="text-subtitle-1 font-weight-bold" style="height: 60px; overflow: hidden;">
            {{ product.name }}
        </v-card-text>
        <v-card-subtitle class="my-1 text-subtitle-1" style="color: rgb(58, 108, 244);">
            {{ product.description }}
        </v-card-subtitle>
        <v-card-subtitle>
            {{ product.category }}
        </v-card-subtitle>

        <v-card-text class="py-1 d-flex align-center">
            <v-rating :model-value="product.average_rating" :readonly="true" size="small" density="compact"
                color="grey-lighten-1" active-color="orange-darken-1" half-increments></v-rating>
            <span class="ml-3 text-caption"> ({{ product.number_of_ratings }})</span>
        </v-card-text>

        <v-card-subtitle>{{ product.price }} TL</v-card-subtitle>

        <v-card-actions>
            <v-btn class="w-100" color="my-default-color" variant="elevated" hover :disabled="loading"
                @click.stop.prevent="addToCart" :loading="loading">
                Sepete Ekle
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
  
<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';

interface Product {
    product_id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    average_rating: number;
    number_of_ratings: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: Array<any>;
    is_in_wishlist: boolean;
}

export default defineComponent({
    name: 'ProductCard',
    props: {
        product: {
            type: Object as PropType<Product>,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props, { emit }: { emit: any }) {
        const { product } = toRefs(props);

        function toggleFavorite() {
            emit('toggle-favorite', product.value);
        }

        function addToCart() {
            emit('add-to-cart', product.value.product_id);
        }

        return {
            toggleFavorite,
            addToCart
        };
    }
});
</script>
  
<style scoped>
.fav-btn {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    box-shadow: none;
}
</style>