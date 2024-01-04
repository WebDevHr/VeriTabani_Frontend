// store/modules/favorites.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Define your RootState type based on your global state
import UserService from '@/services/UserService';

// Define the FavoriteItem type based on your data structure
import { FavoriteItem } from '@/store/modules/favoriteTypes/types';

// Define the state structure for the Favorites module
export interface IFavoritesState {
    items: FavoriteItem[];
}

const favoritesModule: Module<IFavoritesState, RootState> = {
    namespaced: true,

    state: {
        items: [],
    },

    getters: {
        // You may want to define getters that manipulate favorites data, for example:
        productIds: (state): number[] => {
            return state.items.map(item => item.productId.id);
        },
        // Another example could be to get the total count of favorite items
        favoritesCount: (state): number => {
            return state.items.length;
        }
    },

    mutations: {
        SET_FAVORITES_ITEMS(state, items: FavoriteItem[]) {
            state.items = items;
        },
        REMOVE_FROM_FAVORITE(state, product_id: number) {
            const index = state.items.findIndex(item => item.productId.id == product_id)
            index != -1 ? state.items.splice(index, 1) : state.items;
        }
    },

    actions: {
        async fetchFavorites({ commit, rootState }) {
            if (!rootState.user.token) {
                return Promise.reject('User token not found.');
            }

            try {
                const response = await UserService.getFavoriteItems(rootState.user.token);

                // Transform the response to fit the FavoriteItem type if necessary:
                const favoritesData: FavoriteItem[] = response.data.map((favorite: FavoriteItem) => ({
                    ...favorite,
                    id: favorite.productId.id, // Ensure the ID is correctly assigned
                }));
                commit('SET_FAVORITES_ITEMS', favoritesData);

            } catch (error) {
                console.error('Error fetching favorites:', error);
                return Promise.reject(error);
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async toggleFavorite({ commit, rootState }, product_id: number) {
            if (!rootState.user.token) {
                throw new Error('Authentication token not available');
            }

            try {
                const res = await UserService.toggleProductFavorite(product_id, rootState.user.token);
                commit('REMOVE_FROM_FAVORITE', product_id);
                return res.data

            } catch (error) {
                console.error('Error toggling favorite status:', error);
                throw error; // Or dispatch to an error handling action/mutation
            }
        }

        // Possible other actions for favorite items management: add, remove, etc.
    },
};

export default favoritesModule;