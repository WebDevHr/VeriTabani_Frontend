<template>
  <v-app>
    <v-main>
      <v-app-bar app color="my-default-color">
        <v-toolbar-title><v-btn :to="{ name: 'home' }">Final Project</v-btn></v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn v-if="isAdmin" :to="{ name: 'add-product' }">
          ürün ekle
        </v-btn>

        <v-btn prepend-icon="mdi-magnify">
          Ara
        </v-btn>
        <v-btn prepend-icon="mdi-heart-outline" :to="{ name: 'favorite' }">
          Favori
        </v-btn>
        <v-menu>
          <template v-slot:activator="{ isActive, props }">
            <v-btn v-if="!isAuthenticated" v-bind="props"
              :prepend-icon="isActive ? 'mdi-chevron-down' : 'mdi-chevron-up'">
              Giriş yap
            </v-btn>
            <v-btn v-else v-bind="props">
              <div class="d-flex flex-column py-0">
                <span> <v-icon icon="mdi-account"></v-icon> Hesabım</span>
                <span class="text-caption">{{ userName }}</span>
              </div>
            </v-btn>
          </template>

          <v-list v-if="!isAuthenticated">
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-btn :prepend-icon="item.icon" :to="{ name: item.url }" variant="text"
                class="d-flex justify-start align-center w-100">
                {{ item.title }}
              </v-btn>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item v-for="(item, i) in itemsAccount" :key="i">
              <v-btn :prepend-icon="item.icon" :to="{ name: item.url }" variant="text" @click="logoutUser(item.title)"
                class="d-flex justify-start align-center w-100">
                {{ item.title }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn prepend-icon="mdi-cart-outline" :to="{ name: 'cart' }">
          Sepet
        </v-btn>
        <v-btn density="compact" class="d-flex align-center" variant="plain" :ripple="false">
          <v-switch :hide-details="true" v-model="nightMode" false-icon="mdi-weather-sunny" true-icon="mdi-weather-night"
            color="black" inset></v-switch>
        </v-btn>
      </v-app-bar>
      <router-view />
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" rounded="rounded"
        origin="auto" transition="v-snackbar-transition" location="bottom right">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn color="white" @click="hideSnackbar">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-footer class="d-flex flex-column pa-0" elevation="1" color="my-default-color">
        <!-- <div class="bg-black d-flex w-100 align-center px-4">
          <strong>İletişim yollarımız</strong>

          <v-spacer></v-spacer>

          <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="plain" size="small"></v-btn>
        </div>

        <div class="px-4 py-2 text-center w-100">
          {{ new Date().getFullYear() }} — <strong>Final Project</strong>
        </div> -->
      </v-footer>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify'



export default defineComponent({
  name: 'App',

  setup() {
    const theme = useTheme()
    const store = useStore();
    const router = useRouter();
    const nightMode = ref()
    const icons = ref([
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
    ]);


    // Use 'computed' to create a reactive computed reference to part of the state
    const snackbar = computed(() => store.state.snackbar);
    const userName = computed(() => store.state.user.activeUser ? (store.state.user.activeUser.firstName + ' ' + store.state.user.activeUser.lastName) : '');

    const isAdmin = computed(() => store.state.user.activeUser ? store.state.user.activeUser.isAdmin : false);
    // Method to dispatch the 'showSnackbar' action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showSnackbar = (payload: any) => {
      store.dispatch('snackbar/showSnackbar', payload);
    };

    // Helper method to hide the snackbar
    const hideSnackbar = () => {
      showSnackbar({ show: false, color: '', text: '', timeout: 0 }); // Pass the appropriate properties
    };

    watch(nightMode, (value) => {
      theme.global.name.value = value ? 'dark' : 'light'
    });

    const items = [
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
    const itemsAccount = [
      {
        title: 'Hesabım',
        url: 'account',
        icon: 'mdi-account-cog'
      },
      {
        title: 'Siparişlerim',
        url: 'order',
        icon: 'mdi-package'
      },
      {
        title: 'Çıkış yap',
        url: '',
        icon: 'mdi-logout'
      }
    ]

    const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);

    // Use the snackbar directly from the Vuex store
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showGlobalSnackbar = (payload: any) => {
      store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
    };

    const logoutUser = (logoutUser: string) => {
      if (logoutUser == 'Çıkış yap') {
        store.dispatch('user/logoutUser');
        // Redirect to home page or login page after logout
        // The 'true' parameter forces a reload from the server rather than the cache
        router.push({ name: 'home' }).then(() => {
          showGlobalSnackbar({
            show: true,
            color: 'my-default-color',
            text: 'Hesabınızdan çıkış yaptınız!',
            timeout: 3000,
          });
        });
      }
    };

    return {
      isAuthenticated,
      logoutUser,
      items,
      itemsAccount,
      snackbar,
      userName,
      showSnackbar,
      hideSnackbar,
      nightMode,
      icons,
      isAdmin
    };
  }
});
</script>
