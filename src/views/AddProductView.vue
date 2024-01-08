<template>
    <v-container>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" md="8">
                <v-card class="pa-5">
                    <v-card-title class="mb-3">Ürün ekleme</v-card-title>
                    <v-form @submit.prevent="addProduct">
                        <v-text-field v-model="form.name" label="isim" required></v-text-field>
                        <v-text-field v-model="form.description" label="Marka" required></v-text-field>
                        <v-text-field v-model="form.price" label="Fiyat" required></v-text-field>
                        <v-text-field v-model="form.quantityInStock" label="Stok miktari" required></v-text-field>
                        <v-text-field v-model="form.categoryId" label="Kategori numarası" required></v-text-field>
                        <v-text-field v-model="imagesRaw.imagesUrl" label="Ürün fotoları (, ile ayırın)"
                            required></v-text-field>
                        <v-text-field v-model="imagesRaw.altText" label="Fotoların alternatif yazısı"
                            required></v-text-field>
                        <v-btn elevation="1" color="my-default-color" type="submit">ürün ekle</v-btn>
                    </v-form>
                </v-card>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Ref, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
// import { useRouter } from 'vue-router'; // Import useRouter
import AdminService from '@/services/AdminService';
// import { ISnackbarState } from '@/store/modules/snackbar';

interface ImageData {
    imageUrl: string;
    altText: string;
    productId: 0;
}

export default {

    setup() {
        // const router = useRouter(); // Setup the router
        const store = useStore();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token = computed(() => store.state.user ? store.state.user.token : '');

        const form = ref({
            name: '',
            description: '',
            categoryId: null,
            price: null,
            quantityInStock: null,
        });
        const imagesRaw = ref({
            imagesUrl: '',
            altText: ''
        })

        const images: Ref<ImageData[]> = computed(() => {
            let imagesData: ImageData[] = [];
            if (imagesRaw.value && typeof imagesRaw.value.imagesUrl === 'string' && typeof imagesRaw.value.altText === 'string') {
                const imageUrls: string[] = imagesRaw.value.imagesUrl.split(",");
                const altTexts: string[] = imagesRaw.value.altText.split(',');
                for (let i = 0; i < Math.min(imageUrls.length, altTexts.length); i++) {
                    imagesData.push({
                        imageUrl: imageUrls[i].trim(),
                        altText: altTexts[i].trim(),
                        productId: 0
                    })
                }
            }
            return imagesData;
        });


        onMounted(() => {
            // 
        });

        const addProduct = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const productRes = await AdminService.addProduct(token.value, form.value).then((res) => {
                    images.value.forEach((image) => {
                        image.productId = res.data.id
                        AdminService.addImage(token.value, image)
                    })
                })

            } catch (error) {
                console.log(error);
            }

        };

        return {
            form,
            images,
            imagesRaw,
            addProduct
        };
    },
};
</script>
  
<style scoped>
/* Add your styles here */
</style>

