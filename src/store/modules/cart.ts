// store/modules/cart.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Define your RootState type based on your global state
import UserService from '@/services/UserService';

// Define the CartItem type based on your data structure
import { CartItem } from '@/store/modules/cartTypes/types';

// Define the state structure for the Cart module
export interface ICartState {
    items: CartItem[];
}

const cartModule: Module<ICartState, RootState> = {
    namespaced: true, // Use namespaced if you prefer

    state: {
        items: [],
    },

    getters: {
        totalPrice: (state): number => {
            return state.items.reduce((total, item) => total + item.quantity * parseFloat(item.productId.price), 0);
        }
    },

    mutations: {
        SET_CART_ITEMS(state, items: CartItem[]) {
            state.items = items;
        },
        ADD_ONE_QUANTITY(state, cart_item_id: number) {
            const index = state.items.findIndex((item) => item.cart_item_id == cart_item_id);
            if (index !== -1) {
                state.items[index].quantity++;
            }
        },
        REMOVE_ONE_QUANTITY(state, cart_item_id: number) {
            const index = state.items.findIndex((item) => item.cart_item_id == cart_item_id);
            if (index !== -1 && state.items[index].quantity > 0) {
                state.items[index].quantity--;
            }
        },
        RESET_CARD(state) {
            state.items = []
        }
        // Define mutations for adding, removing, emptying, or updating cart items as needed
    },

    actions: {
        // Fetch cart items from the backend and commit to state
        async fetchCartItems({ commit, rootState }) {
            if (!rootState.user.token) return Promise.reject('User token not found.');

            const response = await UserService.getCartItems(rootState.user.token);
            commit('SET_CART_ITEMS', response.data);
            return response.data; // This return is not necessary but can be useful
        },
        // Define other cart-related actions, like addItemToCart, removeItemFromCart, etc.

        // Example action to remove an item from the cart
        async removeItemFromCart({ commit, rootState }, payload: { cartItemId: number, productId: number }) {
            if (!rootState.user.token) return Promise.reject('User token not found.');
            const { cartItemId, productId } = payload;
            try {
                UserService.removeProductFromCart(productId, rootState.user.token);
                // Call the backend service to remove the item from the cart
                // Get the updated cart items
                // Commit the new cart items to the state if necessary
                // For now, let's just filter out the cart item
                commit('REMOVE_ONE_QUANTITY', cartItemId);
            } catch {
                console.log('Database does not take the value.')
            }
        },

        async addItemToCart({ commit, rootState }, payload: { cartItemId: number, productId: number }) {
            if (!rootState.user.token) return Promise.reject('User token not found.');
            const { cartItemId, productId } = payload;
            try {
                UserService.addProductToCart(productId, rootState.user.token);
                // Call your backend API to add one more of the item to the cart
                // Then fetch the updated cart items

                // Here's a hypothetical update for the sake of example

                commit('ADD_ONE_QUANTITY', cartItemId);
            } catch {
                console.log('Database does not take the value.')
            }
        },
        resetCard({ commit }) {
            commit('RESET_CARD');
        },
    },
};

export default cartModule;