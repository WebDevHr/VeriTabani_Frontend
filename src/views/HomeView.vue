<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product.product_id">
        <ProductCard :product="product" :loading="loadingStates[product.product_id]" @toggle-favorite="toggleFavorite"
          @add-to-cart="addToCart" @view-details="goToProductDetails" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import ProductCard from '../components/ProductCard.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '@/store';
import { ISnackbarState } from '@/store/modules/snackbar';

interface product {
  product_id: number,
  name: string,
  category: string,
  description: string,
  price: number,
  average_rating: number,
  number_of_ratings: number,
  images: Array<object>,
  is_in_wishlist: boolean
}

export default defineComponent({
  name: 'HomeView',
  components: {
    ProductCard,
  },
  setup() {
    // Creating a reactive state for products using ref
    const products = ref();
    const perPage = ref(8);
    const page = ref(1);
    const router = useRouter(); // Using useRouter hook to access router instance
    const userId = ref();
    const loadingStates = ref<{ [key: number]: boolean }>({});

    // Fetch products from the ProductService when component is mounted
    const fetchProducts = async () => {
      try {
        // Assuming getProducts returns a Promise containing an array of products
        if (!store.state.user.activeUser || !store.state.user.activeUser.id) {
          userId.value = 0;
        } else {
          userId.value = store.state.user.activeUser.id
        }
        // await ProductService.getProducts(userId.value, perPage.value, page.value);
        products.value = await store.dispatch('product/fetchProducts',
          { userId: userId.value, perPage: perPage.value, page: page.value }); // Set the products data with the response
      } catch (error) {
        console.error('Failed to fetch products:', error);
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

    const addToCart = async (productId: number) => {
      if (!loadingStates.value[productId]) {
        try {
          // Set the loading state for this button to true
          loadingStates.value[productId] = true;
          const token = store.state.user.token;
          if (!token) {
            router.push({ name: 'log-in' });
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
            text: 'Giriş yapmanız gerek!',
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

});
</script>
