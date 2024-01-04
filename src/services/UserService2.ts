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
    updateUser(userId: number, userData: any) {
        return apiClient.patch('/users/' + userId,
            {
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                email: userData.email
            })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

};
