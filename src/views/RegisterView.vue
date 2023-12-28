<template>
    <v-container>
        <v-card class="mx-auto py-5 px-8 px-xs-10 mt-5" max-width="500">
            <v-tabs v-model="tab" align-tabs="center" class="mb-10">
                <v-tab :value="1" :to="{ name: 'log-in' }" min-width="150px">Giriş Yap</v-tab>
                <v-tab :value="2" min-width="150px">Üye Ol</v-tab>
            </v-tabs>
            <v-form ref="form" :model-value="isValid" lazy-validation @submit.prevent="submit">
                <v-text-field v-model="user.firstName" :rules="firstNameRules" label="Adınız" required
                    prepend-icon="mdi-account" />
                <v-text-field v-model="user.lastName" :rules="lastNameRules" label="Soyadınız" required
                    prepend-icon="mdi-account" />
                <v-text-field v-model="user.phoneNumber" :rules="phoneRules" label="Telefon numarası" required
                    prepend-icon="mdi-phone" maxlength="10" />
                <v-text-field v-model="user.email" :rules="emailRules" label="E-posta" required prepend-icon="mdi-email"
                    type="email" />
                <v-text-field v-model="user.password" :rules="passwordRules" label="Şifre" required
                    :type="showPassword ? 'text' : 'password'" prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append="toggleShowPassword" />
                <div class="d-flex justify-end">
                    <v-btn :disabled="!isValid" color="my-default-color" class="mt-3 mr-4" @click="submit">Üye Ol</v-btn>
                </div>
            </v-form>
        </v-card>
    </v-container>
</template>
  
<script lang="ts">
import { Ref, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'; // Import useRouter

interface User {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export default {
    setup() {
        const router = useRouter(); // Setup the router
        const store = useStore();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const form: Ref<any> = ref(null);
        const tab = ref(2);
        const showPassword = ref(false);
        const user = reactive<User>({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
        });

        const resetForm = () => {
            // Reset user object to initial state
            Object.assign(user, {
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                password: '',
            });
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

        const isValid = computed(() => {
            // Implement valid check logic. This is a placeholder for the actual validation logic.
            return true;
        });

        const submit = async () => {
            if (isValid.value && form.value?.validate()) {
                try {
                    // Dispatching the action with the user data
                    // Since the user object here is reactive, consider using `toRaw(user)` if needed
                    const response = await store.dispatch('user/registerUser', user);
                    console.log('Registration success:', response);

                    resetForm();
                    router.push({
                        name: 'log-in', // Use the route name of your login page
                        state: { email: user.email } // Passing params (Not recommended for sensitive information)
                    });

                    // Optional: redirect or update UI upon success
                    // router.push('/dashboard'); // For example

                } catch (error) {
                    console.error('Registration error:', error);
                    alert('Registration failed');
                }
            } else {
                alert('Please correct the errors in the form');
            }
        };

        return {
            tab,
            form,
            user,
            showPassword,
            submit,
            toggleShowPassword,
            firstNameRules,
            lastNameRules,
            phoneRules,
            emailRules,
            passwordRules,
            isValid,
        };
    },
};
</script>
  
<style scoped>
/* Add your styles here */
</style>