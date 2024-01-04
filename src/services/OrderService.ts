/* eslint-disable @typescript-eslint/no-explicit-any */
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
    getOrders(userId: number, token: string) {
        return apiClient.get('/orders?where={"userId":' + userId + "}", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    getAddress(userId: number, token: string) {
        return apiClient.get('/addresses?where={"userId":' + userId + "}", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    updateAddress(addressId: number, token: string, address: any) {
        return apiClient.patch('/addresses/' + addressId,
            {
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    },
    createAddress(token: string, address: any) {
        return apiClient.post('/addresses', {
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            addressType: "ev",
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
            state: address.state,
            userId: address.userId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    },
    async createOrder(token: string, order: any, totalPayment: number, userId: number, address: any) {
        const res = await apiClient.post('/orders', {
            status: 'Hazırlık aşamasında',
            total: totalPayment,
            userId: userId,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((x) => x.data)

        for (let i = 0; i < order.length; i++) {
            await apiClient.post('/order_details', {
                orderId: res.id,
                quantity: order[i].quantity,
                priceAtTimeOfPurchase: order[i].productId.price,
                productId: order[i].productId.id

            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        await apiClient.post('/payment_details', {
            orderId: res.id,
            status: 'Alındı',
            paymentMethod: 'Kredi kartı',
            amount: totalPayment

        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        await apiClient.post('/shipping', {
            orderId: res.id,
            cost: 50,
            country: address.country,
            postalCode: address.postalCode,
            city: address.city,
            address: address.addressLine1 + " " + address.addressLine2,
            shippingType: 'kargo'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })


    }

};
