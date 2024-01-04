<template>
    <v-container>
        <v-row v-if="favoriteProducts && favoriteProducts.length === 0">
            <v-col>
                <v-card class="pa-10 mt-5">
                    <v-card-title class="d-flex justify-center">
                        Favorilerinde birşey yok!
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
        <v-row v-if="favoriteProducts && favoriteProducts.length !== 0">
            <v-col v-for="item in favoriteProducts" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="mx-auto py-5" max-width="344">
                    <v-img v-if="item.productId.images && item.productId.images.length > 0"
                        :src="item.productId.images[0].imageUrl" height="200px"></v-img>
                    <!-- If there are no images, you can display a placeholder image or leave it empty -->
                    <v-img v-else src="https://via.placeholder.com/125" height="200px"></v-img>
                    <v-card-title>{{ item.productId.name }}</v-card-title>
                    <v-card-text>
                        {{ item.productId.description }}
                    </v-card-text>
                    <v-card-actions>
                        <!-- <v-btn class="w-100" color="my-default-color" @click="removeFromFavorites(item.productId.id)"
                            variant="elevated" hover>
                            Remove from Favorites
                        </v-btn> -->
                        <v-dialog v-model="dialog" persistent width="auto">
                            <template v-slot:activator="{ props }">
                                <v-btn class="w-100" color="my-default-color" variant="elevated" hover v-bind="props">
                                    Favoriden sil
                                </v-btn>
                            </template>
                            <v-card class="pa-5">
                                <v-card-subtitle class="text-h6 mb-3">
                                    Ürün favorilerinizden silinsin mi?
                                </v-card-subtitle>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="green-darken-1" variant="text" @click="dialog = false" hover>
                                        <v-icon icon="mdi-close-circle" color="red" size="x-large"></v-icon>
                                    </v-btn>
                                    <v-btn color="green-darken-1" variant="text"
                                        @click="removeFromFavorites(item.productId.id), dialog = false">
                                        <v-icon icon="mdi-check-circle-outline" size="x-large"></v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">

        </v-row>
    </v-container>
</template>
  
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { FavoriteItem } from '@/store/modules/favoriteTypes/types';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const store = useStore();
        const router = useRouter();
        const favoriteProducts = computed<FavoriteItem[]>(() => store.state.favorite.items ? store.state.favorite.items : null);
        const dialog = ref(false)

        onMounted(() => {
            if (!store.state.user.token) {
                router.push({ name: 'log-in' });
            }
            else {
                store.dispatch('favorite/fetchFavorites');
            }
        });
        // Computed property of the favorite items from our Vuex store
        // () => store.state.favorite.items


        // Method to remove an item from favorites
        const removeFromFavorites = (product_id: number) => {
            store.dispatch('favorite/toggleFavorite', product_id);

        };

        return {
            favoriteProducts,
            removeFromFavorites,
            dialog
        };
    },
});
</script>
  
<style scoped>
/* ... Your styles here ... */
</style>