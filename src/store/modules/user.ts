/* eslint-disable @typescript-eslint/no-explicit-any */
// store/modules/user.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Ensure this import points to your RootState definition file
import UserService from '@/services/UserService';

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
        },
        SET_ACTIVE_USER(state, user) {
            state.activeUser = user;
        },
    },
    actions: {
        async loginUser({ commit }, credentials) {
            try {
                const response = await UserService.login(credentials);
                const token = response.data.token; // Adjust this based on the response structure
                const user = response.data.user;
                commit('SET_TOKEN', token);
                commit('SET_ACTIVE_USER', user);
                localStorage.setItem('user-token', token); // Store the token in localStorage (although not recommended for production)
                localStorage.setItem('user-info', JSON.stringify(user));
            } catch (error) {
                console.error('Error logging in:', error);
                throw error;
            }
        },
        logoutUser({ commit }) {
            commit('SET_TOKEN', null);
            localStorage.removeItem('user-token'); // Remove the token from localStorage
            localStorage.removeItem('user-info'); // Remove the token from localStorage
        },
        async registerUser(context, userData) {
            const response = await UserService.register(userData);
            // You might want to commit a mutation to update your state here
            // context.commit('someMutation', dataYouWantToUpdateInState);
            return response; // This will be the resolved value of the Promise
        },
    }
};

export default userModule;