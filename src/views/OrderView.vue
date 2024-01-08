
<template>
    <v-container>
        <v-row v-if="orders && orders.length === 0">
            <v-col>
                <v-card class="pa-10 mt-5">
                    <v-card-title class="d-flex justify-center">
                        Siparişlerinde birşey yok!
                    </v-card-title>
                    <v-card-subtitle class="d-flex justify-center align-center">
                        Alışverişe devame etmek için
                        <v-btn :to="{ name: 'home' }" class="px-2" append-icon="mdi-home" variant="plain"
                            color="blue">Anasayfa</v-btn>
                        geç
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
                <v-card class="pa-5">
                    <v-card-title class="mb-5">Şiparişlerim</v-card-title>
                    <v-card v-for="order in orders" :key="order.id" class="mb-2 pa-3" elevation="0" :border="true">
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-card-subtitle>Sipariş no <b>{{ order.id }}</b></v-card-subtitle>
                                <v-card-subtitle>Sipariş no <b>{{ getTime(order.orderDate) }}</b></v-card-subtitle>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-card-subtitle class="text-green d-flex align-center justify-center">
                                    <v-icon :icon="(order.status == 'tamamlandı') ? 'mdi-check' : 'mdi-timer-sand'"
                                        :color="(order.status == 'tamamlandı') ? 'green' : 'orange'" class="mr-3"></v-icon>
                                    <div :class="(order.status == 'tamamlandı') ? 'text-green' : 'text-orange'">
                                        <b>{{ order.status }}</b>
                                    </div>
                                </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-card-subtitle class="text-green d-flex align-center justify-end">
                                    <b>{{ order.total }} TL</b>
                                </v-card-subtitle>
                            </v-col>
                        </v-row>

                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script lang="ts">
import store from '@/store';
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { useRoute } from 'vue-router';
import OrderService from '@/services/OrderService';
import { ISnackbarState } from '@/store/modules/snackbar';
import useDateFormatter from '@/utilities/useDateFormatter';


interface orderDetails {
    createdAt: string;
    updatedAt: string;
    id: number;
    quantity: number;
    priceAtTimeOfPurchase: number;
    orderId: number;
    productId: number;
}

interface order {
    orderDetails: orderDetails[];
    paymentDetails: object;
    shipping: object;
    createdAt: string;
    updatedAt: string;
    id: number;
    orderDate: string;
    status: string;
    total: number;
    userId: object;
}

export default defineComponent({
    setup() {
        // const route = useRoute();
        const router = useRouter();
        const address = ref()

        const getTime = (isoDateString: string) => {
            const { formattedDate } = useDateFormatter(isoDateString);
            return formattedDate.value
        }

        const orders = ref<order[]>();

        onMounted(async () => {
            if (store.state.user.activeUser)
                orders.value = await OrderService.getOrders(store.state.user.activeUser.id, store.state.user.token ? store.state.user.token : '').then((response) => {
                    return response.data
                });
            else
                router.push({ name: 'log-in' });
        });

        const showGlobalSnackbar = (payload: ISnackbarState) => {
            store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
        };

        return {
            orders,
            address,
            showGlobalSnackbar,
            getTime
        };
    },

});
</script> 