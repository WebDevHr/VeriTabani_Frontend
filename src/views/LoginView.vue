<template>
    <v-container>
        <v-card class="mx-auto py-10 px-5 px-xs-10 mt-5" max-width="500">
            <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" class="mb-10">
                <v-tab :value="1"><v-btn variant="flat">Giriş Yap</v-btn></v-tab>
                <v-tab :value="2"><v-btn variant="flat" to="/register">Üye Ol</v-btn> </v-tab>
            </v-tabs>

            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="email" :rules="emailRules" label="E-Posta" required prepend-icon="mdi-email"
                    type="email"></v-text-field>

                <v-text-field v-model="password" :rules="passwordRules" label="Şifre" required prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword" class="mt-2"></v-text-field>

                <v-btn :disabled="!valid" color="success" class="mt-3 mr-4" @click="submit">
                    Giriş Yap
                </v-btn>
            </v-form>
        </v-card>
    </v-container>
</template>
  
<script>
export default {
    data: () => ({
        tab: 1,
        valid: true,
        email: '',
        emailRules: [
            v => !!v || 'E-posta zorunludur',
            v => /.+@.+\..+/.test(v) || 'Hatalı bir E-posta girdiniz'
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Şifre zorunludur',
            v => v.length >= 8 || 'Şifre en az 8 haneli olmalı'
        ],
        showPassword: false
    }),
    methods: {
        submit() {
            if (this.$refs.form.validate()) {
                // Perform your login logic here
                console.log('Form is valid, submit login request');
            }
        }
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