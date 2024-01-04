/* eslint-disable @typescript-eslint/no-explicit-any */
// store/modules/user.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Ensure this import points to your RootState definition file
import UserService from '@/services/UserService';
import UserService2 from '@/services/UserService2';

export interface IUserState {
    token: string | null;
    activeUser: any; // Define a more specific type for your user here if possible
}

const userModule: Module<IUserState, RootState> = {
    namespaced: true,
    state: {
        token: localStorage.getItem('user-token') || null,
        activeUser: localStorage.getItem('user-info') ? JSON.parse(localStorage.getItem('user-info') as string) : null,
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
            console.log(state.token)
        },
        SET_ACTIVE_USER(state, user) {
            state.activeUser = user;
        },
    },
    actions: {
        async loginUser({ commit }, credentials) {
            const response = await UserService.login(credentials);
            const token = response.data.token; // Adjust this based on the response structure
            const user = response.data.user;
            commit('SET_TOKEN', token);
            commit('SET_ACTIVE_USER', user);
            localStorage.setItem('user-token', token); // Store the token in localStorage (although not recommended for production)
            localStorage.setItem('user-info', JSON.stringify(user));
            // eslint-disable-next-line no-empty

        },
        logoutUser({ commit }) {
            commit('SET_TOKEN', null);
            localStorage.removeItem('user-token'); // Remove the token from localStorage
            localStorage.removeItem('user-info'); // Remove the token from localStorage
        },
        registerUser(context, userData: { firstName: string; lastName: string; phoneNumber: number; email: string; password: string }) {
            console.log("this is it", userData)
            const response = UserService.register(userData);

            // You might want to commit a mutation to update your state here
            // context.commit('someMutation', dataYouWantToUpdateInState);
            return response; // This will be the resolved value of the Promise
        },


        async updateUser({ commit }, userData) {
            const userId = this.state.user.activeUser.id
            const response = await UserService2.updateUser(userId, userData);
            const user = {
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                id: response.data.id,
                phoneNumber: response.data.phoneNumber,
                isAdmin: response.data.isAdmin,
                isActive: response.data.isActive,
                createdAt: response.data.createdAt,
                updatedAt: response.data.updatedAt
            };
            commit('SET_ACTIVE_USER', user);
            localStorage.setItem('user-info', JSON.stringify(user));
            // You might want to commit a mutation to update your state here
            // context.commit('someMutation', dataYouWantToUpdateInState);
            return response; // This will be the resolved value of the Promise
        },

        async updatePassword({ state }, passwords) {
            const token = state.token
            if (token) {
                const response = await UserService.updatePassword(token, passwords.password, passwords.newPassword);
                return response; // This will be the resolved value of the Promise
            }

            return 'olmadi'
        },
    }
};

export default userModule;