<template>
  <v-app>
    <v-main>
      <v-app-bar app>
        <v-toolbar-title>Final Project</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn prepend-icon="mdi-magnify">
          Ara
        </v-btn>
        <v-btn prepend-icon="mdi-heart-outline">
          Favori
        </v-btn>
        <v-menu>
          <template v-slot:activator="{ isActive, props }">
            <v-btn v-bind="props" :prepend-icon="isActive ? 'mdi-chevron-down' : 'mdi-chevron-up'">
              Giriş yap
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-btn :prepend-icon="item.icon" :to="{ name: item.url }" variant="text">
                {{ item.title }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn prepend-icon="mdi-cart-outline">
          Sepet
        </v-btn>
      </v-app-bar>
      <router-view />
      <v-footer></v-footer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',

  data() {
    return {
      items: [
        {
          title: 'Giriş yap',
          url: 'log-in',
          icon: 'mdi-login'
        },
        {
          title: 'Üye ol',
          url: 'register',
          icon: 'mdi-account-plus-outline'
        }
      ]
      //
    }
  },
})
</script>
