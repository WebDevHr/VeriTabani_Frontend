// store.ts
import { createStore } from 'vuex';
import user from './modules/user'; // Import the user module
import snackbar from './modules/snackbar';
import cart from './modules/cart';
import favorite from './modules/favorite';
import product from './modules/product';

export default createStore({
  modules: {
    user, // Include the user module
    snackbar,
    cart,
    favorite,
    product
  }
});

