import axios from "axios";

const apiClient = axios.create({
    baseURL: `http://localhost:1337/api/v1`,
    withCredentials: false, // This is the default
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register(userData: any) {
        return apiClient.post('/register', userData);
    },
    login(credentials: { email: string; password: string }) {
        return apiClient.post('/login', credentials);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUser(userId: number, userData: any) {
        return apiClient.patch('/users/' + userId,
            {
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                email: userData.email
            })
    },
    getCartItems(token: string) {
        return apiClient.get('/cart/get-cart-items', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    },
    removeProductFromCart(productId: number, token: string) {
        return apiClient.post('/cart/remove-product-from-cart', { productId: productId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    },
    addProductToCart(productId: number, token: string) {
        return apiClient.post('/cart/add-product-to-cart?productId=' + productId, { productId: productId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    },
    getFavoriteItems(token: string) {
        return apiClient.get('/wishlist', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    },
    toggleProductFavorite(productId: number, token: string) {
        return apiClient.post("/wishlist/toggle-favorite", { productId: productId }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatePassword(token: string, password: any, newPassword: any) {
        return apiClient.patch('/change-password',
            {
                password: password,
                newPassword: newPassword
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
};
