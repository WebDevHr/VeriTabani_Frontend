<template>
    <v-container>
        <!-- Product Details -->
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="py-10 px-2" elevation="0">
                    <!-- Main Image Carousel -->
                    <v-carousel ref="carousel" height="400" hide-delimiters show-arrows="hover" v-model="model">
                        <v-carousel-item v-for="(image, i) in product.images" :key="i" @click="openDialog(i)">
                            <v-img :src="image" height="100%"></v-img>
                        </v-carousel-item>
                    </v-carousel>

                    <!-- Carousel Dots with Thumbnails -->
                    <div class="carousel-dots d-flex justify-center align-center mt-10">
                        <v-avatar v-for="(image, i) in product.images" :key="`dot-${i}`" size="58"
                            class="mr-5 pa-2 clickable-avatar border rounded" v-ripple @click="model = i" rounded="0">
                            <v-img :src="image"></v-img>
                        </v-avatar>
                    </div>
                </v-card>
            </v-col>

            <!-- Modal/Dialog for Image Zoom -->
            <v-dialog v-model="dialog" width="700" height="500">
                <template v-slot:default="{ isActive }">
                    <v-card>
                        <v-img :src="product.images[currentImage]" :style="!zoomed ? 'cursor: zoom-in' : 'cursor: zoom-out'"
                            @click="zoomIn($event)"></v-img>
                        <v-card-actions>
                            <v-btn color="primary" text @click="previousImage">
                                Previous
                            </v-btn>
                            <v-btn color="primary" text @click="nextImage">
                                Next
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon @click.stop="isActive.value = false" class="">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>

            <v-spacer></v-spacer>

            <v-col cols="11" md="7" class="mx-auto">
                <!-- Product Information -->

                <v-card class="mt-10" elevation="0">
                    <v-card-title>{{ product.name }}</v-card-title>
                    <v-card-subtitle>{{ product.category }}</v-card-subtitle>
                    <v-card-subtitle class="my-1">{{ product.description }}</v-card-subtitle>
                    <v-card-text class="py-1 d-flex align-center">
                        <v-rating :model-value="product.rating" :readonly="true" size="small" density="compact"
                            color="grey-lighten-1" active-color="orange-darken-1" half-increments></v-rating>
                        <span class="ml-3 text-caption"> ({{ product.numberOfRating }})</span>
                    </v-card-text>
                    <v-card-subtitle>{{ product.price }} TL</v-card-subtitle>
                </v-card>

                <!-- Rating Section -->

                <!-- Comments Section -->

            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Comments</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Comments List -->
                            <v-list dense>
                                <v-list-item v-for="(comment, i) in product.comments" :key="i">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ comment.author }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <!-- Add Comment Form -->
                            <v-form>
                                <v-textarea label="Add a comment" v-model="newComment"></v-textarea>
                                <v-btn color="primary" @click="addComment">Post Comment</v-btn>
                            </v-form>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
export default {
    data() {
        return {
            model: 0,
            currentImage: 0,
            dialog: false,
            zoomed: false,
            product: {
                name: 'Product Name',
                description: 'Product Description',
                price: 'Product Price',
                rating: 4,
                numberOfRatings: 80,
                images: [
                    'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
                    'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg',
                    'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg'
                ],
                comments: [
                    { author: 'User1', content: 'Great product!' },
                    // ... other comments
                ]
            },
            newComment: ''
        };
    },
    methods: {
        addComment() {
            // Logic to add a new comment
            // Push the newComment to product.comments array
            // Reset newComment
            const comment = {
                author: 'New User', // Should be replaced with the name of the logged-in user
                content: this.newComment
            };

            if (this.newComment.trim()) {
                this.product.comments.push(comment);
                this.newComment = '';
            }
        },
        openDialog(index) {
            this.currentImage = index;
            this.dialog = true;
        },
        changeImage(index) {
            this.currentImage = index;
            // Assuming you have a reference to the carousel, manually change the active image
            this.$refs.carousel.select(1, true);
        },
        zoomIn(event) {
            const imgElement = event.target;
            if (!this.zoomed) {
                // Apply your desired zoom effect
                imgElement.style.transform = 'scale(2)';
                this.zoomed = true;
            } else {
                imgElement.style.transform = 'scale(1)';
                this.zoomed = false;
            }
        },
        previousImage() {
            // Go to previous image
            if (this.currentImage > 0) {
                this.currentImage -= 1;
            }
        },
        nextImage() {
            // Go to next image
            if (this.currentImage < this.product.images.length - 1) {
                this.currentImage += 1;
            }
        },
    }
}
</script>
  
<style scoped>
.clickable-avatar:hover {
    cursor: pointer;
}

/* Add styles for your product details page here */
</style>

