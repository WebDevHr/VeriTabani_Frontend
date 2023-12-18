<template>
    <v-container>
        <v-card class="mx-auto py-10 px-5 px-xs-10 mt-5" max-width="500">
            <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" class="mb-10">
                <v-tab :value="1"><v-btn variant="flat" to="/log-in">Giriş Yap</v-btn></v-tab>
                <v-tab :value="2"><v-btn variant="flat">Üye Ol</v-btn></v-tab>
            </v-tabs>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="firstName" :rules="firstNameRules" label="Adınız" required
                    prepend-icon="mdi-account"></v-text-field>

                <v-text-field v-model="lastName" :rules="lastNameRules" label="Soyadınız" required
                    prepend-icon="mdi-account"></v-text-field>

                <v-text-field v-model="phoneNumber" :rules="phoneRules" label="Telefon numarası" required
                    prepend-icon="mdi-phone" maxlength="10"></v-text-field>

                <v-text-field v-model="email" :rules="emailRules" label="E-posta" required prepend-icon="mdi-email"
                    type="email"></v-text-field>

                <v-text-field v-model="password" :rules="passwordRules" label="Şifre" required
                    :type="showPassword ? 'text' : 'password'" prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="toggleShowPassword"></v-text-field>

                <v-btn :disabled="!valid" color="success" class="mt-3 mr-4" @click="submit">
                    Register
                </v-btn>
            </v-form>
        </v-card>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            tab: 2,
            valid: true,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            showPassword: false,
            firstNameRules: [
                v => !!v || 'Ad zorunludur',
                v => v.length <= 20 || 'Ad maximum 20 karakter olmalı',
            ],
            lastNameRules: [
                v => !!v || 'Soyad zorunludur',
                v => v.length <= 20 || 'Soyad maximum 20 karakter olmalı',
            ],
            phoneRules: [
                v => !!v || 'Telefon numarası zorunludur',
                v => /^\d{10}$/.test(v) || 'Telefon numarası en az 10 haneli olmalı',
            ],
            emailRules: [
                v => !!v || 'E-posta zorunludur',
                v => /.+@.+\..+/.test(v) || 'Hatalı E-posta',
            ],
            passwordRules: [
                v => !!v || 'Şifre zorunludur',
                v => v.length >= 8 || 'Şifre en az 8 haneli olmalı',
            ],
        };
    },
    methods: {
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
        submit() {
            if (this.$refs.form.validate()) {
                // Handle the register logic here with this.firstName, this.lastName, etc.
                alert('Registration form is valid');
            } else {
                alert('Please correct the errors in the form');
            }
        }
    }
};
</script>
  
<style scoped></style>