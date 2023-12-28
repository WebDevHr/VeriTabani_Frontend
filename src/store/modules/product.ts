// store/modules/products.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Define your RootState type based on your global state
import ProductService from '@/services/ProductService';

// Define the Product type based on your data structure
import { Product } from '@/store/modules/productTypes/types';

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
        // You can define getters for filtered products, favorite products etc.
    },

    mutations: {
        SET_PRODUCTS(state, products: Product[]): void {
            state.products = products;
        }
        // Add more mutations as needed
    },

    actions: {
        async fetchProducts({ commit }, { userId, perPage, page }): Promise<void> {

            const response = await ProductService.getProducts(userId, perPage, page);
            commit('SET_PRODUCTS', response.data);
            return response.data
        },

        // Add more actions as needed, such as updating a product, etc.
    },
};

export default productsModule;