// store/modules/products.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Define your RootState type based on your global state
import ProductService from '@/services/ProductService';

// Define the Product type based on your data structure
import { Product } from '@/store/modules/productTypes/types';
import store from '@/store';

// Define the state structure for the Products module
export interface IProductsState {
    products: Product[];
}

const productsModule: Module<IProductsState, RootState> = {
    namespaced: true,

    state: {
        products: [],
    },

    getters: {
    },

    mutations: {
        SET_PRODUCTS(state, products: Product[]): void {
            state.products = products;
        },

    },

    actions: {
        async fetchProducts({ commit }, { userId, perPage, page }): Promise<void> {

            const response = await ProductService.getProducts(userId, perPage, page);
            commit('SET_PRODUCTS', response.data.products);
            return response.data.products
        },
        async fetchProductById({ state }, productId): Promise<Product | undefined> {
            const token = store.state.user.token ? store.state.user.token : '';
            const response = await ProductService.getProduct(productId, token);
            return response.data

        }

    },
};

export default productsModule;