<template>
  <product-card />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import ProductCard from '../components/ProductCard.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    ProductCard,
  },
});
</script>
