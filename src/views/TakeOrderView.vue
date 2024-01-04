<template>
    <v-container>
        <v-row class="my-10">
            <v-col cols="12" sm="8">
                <v-card class="pa-8">
                    <v-card-title>Teslimat adresim</v-card-title>
                    <v-card-text v-if="hasAddress" class="rounded">
                        {{ primaryAddress?.addressLine1 }} - {{ primaryAddress?.addressLine2 }}<br />
                        {{ primaryAddress?.state }} - {{ primaryAddress?.city }}<br />
                        {{ primaryAddress?.postalCode }}
                    </v-card-text>
                    <v-card-text v-else class="rounded">
                        Mevcüt adresiniz yok!
                    </v-card-text>
                    <v-btn class="ml-4" color="my-default-color" elevation="1" @click="openDialog">
                        <v-icon left>mdi-plus</v-icon>
                        Adres {{ hasAddress ? 'değiştir' : 'ekle' }}
                    </v-btn>
                </v-card>
                <v-card class="pa-8 mt-5">
                    <v-card-title>Kart bilgileri</v-card-title>
                    <v-card-text>
                        xxxx - xxxx - xxxx - xxxx
                    </v-card-text>
                    <v-checkbox v-model="creditCart" label="Kartı onayla"></v-checkbox>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card class="pa-8">
                    <v-card-title>ÖDENECEK TUTAR</v-card-title>
                    <v-card-title v-if="hasAddress" class="rounded text-green-lighten-1">
                        {{ totalPayment }} TL
                    </v-card-title>
                    <v-checkbox label="Ön bilgilendirme formunu ve Mesafesli satış sözleşmesini onaylıyorum."
                        v-model="certifyRules"></v-checkbox>
                    <v-btn class="w-100" color="my-default-color" elevation="1" @click="takeOrder">
                        Siparişi onayla
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:default="{ isActive }">
                <v-card>
                    <v-form @submit.prevent="submitAddress" class="border px-10 pb-10 rounded">
                        <div class="d-flex justify-end py-5">
                            <v-btn icon @click.stop="isActive.value = false" variant="plain">
                                <v-icon icon="mdi-close" size="large"></v-icon>
                            </v-btn>
                        </div>
                        <v-text-field v-model="addressForm.addressLine1" label="Adres 1. satır" required></v-text-field>

                        <v-text-field v-model="addressForm.addressLine2" label="Adres 2. satır"></v-text-field>

                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="addressForm.city" label="Şehir" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="addressForm.state" label="Mahalle"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-text-field v-model="addressForm.postalCode" label="Posta kodu" required></v-text-field>

                        <v-text-field v-model="addressForm.country" label="Ülke" required></v-text-field>

                        <v-btn type="submit" elevation="1" color="my-default-color" @click="dialog = !dialog">
                            Adresi kaydet
                        </v-btn>
                    </v-form>
                </v-card>
            </template>
        </v-dialog>

        <v-dialog v-model="gotConfirmed" persistent max-width="500px">
            <template v-slot:default="{ isActive }">
                <v-card>
                    <v-progress-linear color="green-lighten-1" indeterminate rounded height="6"></v-progress-linear>
                    <v-sheet elevation="12" max-width="600" rounded="lg" width="100%" class="pa-4 text-center mx-auto">
                        <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>

                        <h2 class="text-h5 mb-6">Siparişin alındı</h2>

                        <p class="mb-4 text-medium-emphasis text-body-2">
                            Siparişlerini görmek için, tıkla
                            <v-btn color="blue" variant="plain" :to="{ name: 'order' }"
                                @click="clearTO">Siparişlerim</v-btn>
                            <br>

                            Yoksa anasayfaya yönlendirilirsin!
                        </p>

                        <v-divider class="mb-4"></v-divider>

                        <div class="text-end">
                            <v-btn @click.stop="isActive.value = false" class="text-none" color="success" rounded
                                variant="flat" width="90">
                                Tamam
                            </v-btn>
                        </div>
                    </v-sheet>
                </v-card>
            </template>
        </v-dialog>
    </v-container>
</template>
  
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, computed } from 'vue';
import OrderService from '@/services/OrderService';
import store from '@/store';
import { ISnackbarState } from '@/store/modules/snackbar';
import router from '@/router';
// import { useRouter } from 'vue-router';
// import { useRoute } from 'vue-router';

interface Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: number;
    country: string;
    addressType: string;
    UpdatedAt: string;
    createAt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vendorId: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: any;
}

export default defineComponent({
    name: 'AddressComponent',
    setup() {
        const dialog = ref(false);
        const primaryAddress = ref<Address | null>(null);
        const hasAddress = ref(false); // computed logic for address presence
        const creditCart = ref(false);
        const certifyRules = ref(false);
        const gotConfirmed = ref(false);
        let timeoutForGotOrder: number
        // const route = useRoute();
        const totalPayment = computed(() => {
            return store.state.cart.items.reduce((total, item) => {
                return total + (item.quantity * parseFloat(item.productId.price));
            }, 0)
        });

        const addressForm = reactive<Address>({
            id: 0,
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: 0,
            country: '',
            addressType: 'ev',
            UpdatedAt: '',
            createAt: '',
            vendorId: [],
            userId: null
        });

        const fetchAddress = async () => {
            try {
                if (store.state.user.token) {
                    const response = await OrderService.getAddress(store.state.user.activeUser.id, store.state.user.token);
                    if (response.data.length > 0) {
                        primaryAddress.value = response.data[0];
                        hasAddress.value = true;
                    }
                }
            } catch (error) {
                console.error('Failed to fetch address:', error);
                // Implement user-friendly error handling
            }
        };

        const submitAddress = async () => {
            const sendingAddress = {
                addressLine1: addressForm.addressLine1,
                addressLine2: addressForm.addressLine2,
                city: addressForm.city,
                state: addressForm.state,
                postalCode: addressForm.postalCode,
                country: addressForm.country,
            };
            if (store.state.user.token && primaryAddress.value && primaryAddress.value.id) {
                await OrderService.updateAddress(primaryAddress.value.id, store.state.user.token, sendingAddress)
                primaryAddress.value = addressForm;
            }
            else if (store.state.user.token) {
                addressForm.userId = store.state.user.activeUser.id
                await OrderService.createAddress(store.state.user.token, addressForm);
                primaryAddress.value = addressForm;
                hasAddress.value = true;
            }
            closeDialog();
            // Submit address logic goes here
        };

        const openDialog = () => {
            dialog.value = true;
        };

        const closeDialog = () => {
            dialog.value = false;
        };

        const clearTO = () => {
            clearTimeout(timeoutForGotOrder)
        }

        const takeOrder = async () => {
            if (creditCart.value && certifyRules.value && primaryAddress.value && store.state.user.token) {
                await OrderService.createOrder(
                    store.state.user.token,
                    store.state.cart.items,
                    totalPayment.value,
                    store.state.user.activeUser.id,
                    primaryAddress.value
                )
                gotConfirmed.value = true;
                timeoutForGotOrder = setTimeout(() => {
                    router.push({ name: 'home' })
                }, 4000);
            } else {
                showGlobalSnackbar({
                    show: true,
                    color: 'red-darken-3',
                    text: 'Adres, Kart onayı veya Ön bilgilendirme ve Mesafeli satış onaylarını kontrol edin.',
                    timeout: 3000,
                });
            }
        };

        const showGlobalSnackbar = (payload: ISnackbarState) => {
            store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
        };

        onMounted(() => {
            fetchAddress();
        });

        return {
            dialog,
            addressForm,
            creditCart,
            hasAddress,
            primaryAddress,
            certifyRules,
            totalPayment,
            gotConfirmed,
            submitAddress,
            openDialog,
            closeDialog,
            takeOrder,
            clearTO
        };
    },
});
</script>
  
<style>
/* Add your styles here */
</style>