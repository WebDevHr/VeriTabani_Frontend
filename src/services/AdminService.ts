import axios from "axios";

const apiClient = axios.create({
    baseURL: `http://localhost:1337`,
    withCredentials: false, // This is the default
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export default {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addProduct(token: string, productData: any) {
        return apiClient.post('/products', productData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addImage(token: string, image: any) {
        return apiClient.post('/product_images', image
            , {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

};
