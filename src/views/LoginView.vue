<template>
    <v-container>
        <v-card class="mx-auto py-5 px-8 px-xs-10 mt-5" max-width="500">
            <v-tabs v-model="tab" align-tabs="center" class="mb-10">
                <v-tab :value="1" min-width="150px">Giriş Yap</v-tab>
                <v-tab :value="2" :to="{ name: 'register' }" min-width="150px">Üye Ol</v-tab>
            </v-tabs>

            <v-form ref="form" @submit.prevent="submit" lazy-validation>
                <v-text-field v-model="email" :rules="emailRules" label="E-Posta" required prepend-icon="mdi-email"
                    type="email" name="email"></v-text-field>

                <v-text-field v-model="password" :rules="passwordRules" label="Şifre" required prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="toggleShowPassword" class="mt-2" name="password"></v-text-field>

                <!-- Note the type="submit" which is important for form submission -->
                <div class="d-flex justify-end">
                    <v-btn type="submit" :disabled="!valid" color="my-default-color" :border="true" class="mt-3 mr-4">
                        Giriş Yap
                    </v-btn>
                </div>
            </v-form>
        </v-card>

    </v-container>
</template>
  
<script lang="ts">
import { ref, computed, Ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ISnackbarState } from '@/store/modules/snackbar';

export default {
    name: 'Log-in',
    setup() {
        const store = useStore();
        const tab: Ref<number> = ref(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const form: Ref<any> = ref(null);
        const router = useRouter();
        const valid = ref(true);
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);

        const emailRules = computed(() => [
            (v: string) => !!v || 'E-posta zorunludur',
            (v: string) => /.+@.+\..+/.test(v) || 'Geçerli bir E-posta adresi giriniz'
        ]);

        const passwordRules = computed(() => [
            (v: string) => !!v || 'Şifre zorunludur',
            (v: string) => v.length >= 8 || 'Şifre en az 8 karakter olmalıdır'
        ]);

        function toggleShowPassword() {
            showPassword.value = !showPassword.value;
        }

        const showGlobalSnackbar = (payload: ISnackbarState) => {
            store.dispatch('snackbar/showSnackbar', payload); // Dispatch the action, including the namespace
        };

        const submit = async () => {
            if (form.value?.validate()) {
                try {
                    await store.dispatch('user/loginUser', {
                        email: email.value,
                        password: password.value,
                    });

                    showGlobalSnackbar({
                        show: true,
                        color: 'my-default-color',
                        text: 'Merhaba, ' + store.state.user.activeUser.firstName + '!',
                        timeout: 3000,
                    });

                    // Perform redirection or other actions after login
                    router.push('/');

                } catch (error) {
                    console.error('Login error:', error);
                    showGlobalSnackbar({
                        show: true,
                        color: 'red-darken-3',
                        text: 'Giriş başarısız oldu.',
                        timeout: 6000,
                    });
                }
            }
        };

        // Return values to use in the template
        return {
            email,
            password,
            valid,
            showPassword,
            tab,
            form,
            emailRules,
            passwordRules,
            toggleShowPassword,
            submit,
        };
    }
};
</script>
  
<style>
.fixed-width-form {
    max-width: 500px;
    margin: auto;
    /* This centers the form in the container */
}
</style>