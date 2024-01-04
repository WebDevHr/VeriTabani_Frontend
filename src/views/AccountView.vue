<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card class="mx-auto py-5 px-8 px-xs-10 mt-5 border">
                    <v-card-title>
                        Kullancı bilgilerim
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="mx-auto py-5 px-8 px-xs-10 border">
                    <v-progress-linear :active="profileLoading" :indeterminate="profileLoading" absolute bottom
                        color="green-lighten-2"></v-progress-linear>
                    <v-card-title class="mb-3">Kişisel bilgilerim</v-card-title>
                    <v-form ref="form" :model-value="isValid" validate-on="lazy" @submit.prevent="updateUser">
                        <div class="d-flex">
                            <v-text-field class="mr-2 w-25" v-model="user.firstName" :rules="firstNameRules"
                                label="Adınız" />
                            <v-text-field class="w-25" v-model="user.lastName" :rules="lastNameRules" label="Soyadınız"
                                required />
                        </div>
                        <v-text-field v-model="user.phoneNumber" :rules="phoneRules" label="Telefon numarası" required
                            maxlength="10" />
                        <v-text-field v-model="user.email" :rules="emailRules" label="E-posta" required type="email" />
                        <div class="d-flex justify-end">
                            <v-btn type="submit" :disabled="!isValid" color="my-default-color" class="mt-3 mr-4">
                                Bilgilerimi kaydet
                            </v-btn>
                        </div>
                    </v-form>
                </v-card>
                <v-card class="mx-auto py-5 px-8 px-xs-10 border mt-6">
                    <v-progress-linear :active="passwordLoading" :indeterminate="passwordLoading" absolute bottom
                        color="green-lighten-2"></v-progress-linear>
                    <v-card-title class="mb-3">Şifre güncelleme</v-card-title>
                    <v-form ref="form2" :model-value="isValid" validate-on="lazy" @submit.prevent="updatePassword">
                        <v-text-field v-model="user.password" :rules="passwordRules" label="Şu anki şifre" required
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="toggleShowPassword" />
                        <v-text-field v-model="newPassword" :rules="passwordRules" label="Yeni şifre" required
                            :type="showNewPassword ? 'text' : 'password'"
                            :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append="toggleShowNewPassword" />
                        <div class="d-flex justify-end">
                            <v-btn type="submit" :disabled="!isValid" color="my-default-color" class="mt-3 mr-4">
                                Şifremi güncelle
                            </v-btn>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card class="mx-auto py-5 px-8 px-xs-10 border">
                    <v-progress-linear :active="addressLoading" :indeterminate="addressLoading" absolute bottom
                        color="green-lighten-2"></v-progress-linear>
                    <v-card-title class="mb-3">Adres bilgilerim</v-card-title>
                    <v-form @submit.prevent="updateAddress">
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
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Ref, ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
// import { useRouter } from 'vue-router'; // Import useRouter
import OrderService from '@/services/OrderService';
import { ISnackbarState } from '@/store/modules/snackbar';
import router from '@/router';

interface User {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

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

export default {
    setup() {
        const dialog = ref(false);
        const primaryAddress = ref<Address | null>(null);
        const hasAddress = ref(false); // computed logic for address presence
        const gotConfirmed = ref(false);
        // const router = useRouter(); // Setup the router
        const store = useStore();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const form: Ref<any> = ref(null);
        const showPassword = ref(false);
        const showNewPassword = ref(false);
        const profileLoading = ref(false);
        const addressLoading = ref(false);
        const passwordLoading = ref(false);

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



        onMounted(async () => {
            if (!store.state.user.token) {
                router.push({ name: 'log-in' })
            }
            const address = await OrderService.getAddress(store.state.user.activeUser.id, store.state.user.token).then((res) => {
                return res.data[0]
            })
            if (address) {
                addressForm.id = address.id
                addressForm.addressLine1 = address.addressLine1;
                addressForm.addressLine2 = address.addressLine2;
                addressForm.city = address.city;
                addressForm.state = address.state;
                addressForm.postalCode = address.postalCode;
                addressForm.country = address.country;
            }

        })

        const user = reactive<User>({
            firstName: store.state.user.activeUser.firstName,
            lastName: store.state.user.activeUser.lastName,
            phoneNumber: store.state.user.activeUser.phoneNumber,
            email: store.state.user.activeUser.email,
            password: '',
        });

        const newPassword = ref('');

        const updateAddress = async () => {
            addressLoading.value = true;
            try {
                const sendingAddress = {
                    id: addressForm.id,
                    addressLine1: addressForm.addressLine1,
                    addressLine2: addressForm.addressLine2,
                    city: addressForm.city,
                    state: addressForm.state,
                    postalCode: addressForm.postalCode,
                    country: addressForm.country,
                };
                if (store.state.user.token && sendingAddress && sendingAddress.id) {
                    await OrderService.updateAddress(sendingAddress.id, store.state.user.token, sendingAddress)
                    primaryAddress.value = addressForm;
                }
                else if (store.state.user.token) {
                    addressForm.userId = store.state.user.activeUser.id
                    await OrderService.createAddress(store.state.user.token, addressForm);
                    primaryAddress.value = addressForm;
                    hasAddress.value = true;
                }
            }
            catch (error) {
                console.log(error);
                showGlobalSnackbar({
                    show: true,
                    color: 'red-darken-3',
                    text: 'Adresi kontrol edin.',
                    timeout: 5000,
                });
            }
            finally {
                setTimeout(() => {
                    addressLoading.value = false;
                }, 600);
            }
        };

        const showGlobalSnackbar = (payload: ISnackbarState) => {
            store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
        };

        const firstNameRules = [
            (v: string) => !!v || 'Ad zorunludur',
            (v: string) => (v && v.length <= 20) || 'Ad maximum 20 karakter olmalı',
        ];
        const lastNameRules = [
            (v: string) => !!v || 'Soyad zorunludur',
            (v: string) => (v && v.length <= 20) || 'Soyad maximum 20 karakter olmalı',
        ];
        const phoneRules = [
            (v: string) => !!v || 'Telefon numarası zorunludur',
            (v: string) => /^\d{10}$/.test(v) || 'Telefon numarası en az 10 haneli olmalı',
        ];
        const emailRules = [
            (v: string) => !!v || 'E-posta zorunludur',
            (v: string) => /.+@.+\..+/.test(v) || 'Hatalı E-posta',
        ];
        const passwordRules = [
            (v: string) => !!v || 'Şifre zorunludur',
            (v: string) => (v && v.length >= 8) || 'Şifre en az 8 haneli olmalı',
        ];

        const toggleShowPassword = () => {
            showPassword.value = !showPassword.value;
        };

        const toggleShowNewPassword = () => {
            showNewPassword.value = !showNewPassword.value;
        };

        const isValid = computed(() => {
            // Implement valid check logic. This is a placeholder for the actual validation logic.
            return true;
        });

        const updateUser = async () => {
            if (isValid.value && form.value?.validate()) {
                try {
                    profileLoading.value = true;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const response = await store.dispatch('user/updateUser', user);

                    showGlobalSnackbar({
                        show: true,
                        color: 'green-darken-3',
                        text: 'Bilgileriniz güncellendi.',
                        timeout: 3000,
                    });

                } catch (error) {
                    console.error('Registration error:', error);
                    showGlobalSnackbar({
                        show: true,
                        color: 'red-darken-3',
                        text: 'Bilgileri kontrol edin.',
                        timeout: 5000,
                    });
                }
                finally {
                    setTimeout(() => {
                        profileLoading.value = false;
                    }, 1000);
                }
            } else {
                alert('Please correct the errors in the form');
            }
        };

        const updatePassword = async () => {
            try {
                passwordLoading.value = true;
                const response = await store.dispatch('user/updatePassword', { password: user.password, newPassword: newPassword.value });
                showGlobalSnackbar({
                    show: true,
                    color: 'green-darken-3',
                    text: response.data.description,
                    timeout: 5000,
                });
            }
            catch (error) {
                console.log(error);
                showGlobalSnackbar({
                    show: true,
                    color: 'red-darken-3',
                    text: 'Sifrenizi kontrol edin.',
                    timeout: 5000,
                });
            }
            finally {
                setTimeout(() => {
                    passwordLoading.value = false;
                }, 1000);
            }
        };

        return {
            form,
            user,
            showPassword,
            firstNameRules,
            lastNameRules,
            phoneRules,
            emailRules,
            passwordRules,
            isValid,
            dialog,
            addressForm,
            hasAddress,
            primaryAddress,
            gotConfirmed,
            profileLoading,
            addressLoading,
            passwordLoading,
            newPassword,
            showNewPassword,
            updateUser,
            toggleShowPassword,
            toggleShowNewPassword,
            updateAddress,
            updatePassword
        };
    },
};
</script>
  
<style scoped>
/* Add your styles here */
</style>