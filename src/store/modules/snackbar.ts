// store/modules/snackbar.ts
import { Module } from 'vuex';
import { RootState } from '@/store/types'; // Adjust if needed to point to your RootState definition

// Define your state and its type for the snackbar module
export interface ISnackbarState {
    show: boolean;
    color: string;
    text: string;
    timeout: number;
}

// Module
const snackbarModule: Module<ISnackbarState, RootState> = {
    namespaced: true,
    state: {
        show: false,
        color: '',
        text: '',
        timeout: 3000,
    },
    mutations: {
        SET_SNACKBAR(state, payload: ISnackbarState) {
            state.show = payload.show;
            state.color = payload.color;
            state.text = payload.text;
            state.timeout = payload.timeout;
        },
    },
    actions: {
        showSnackbar({ commit }, payload: { color: string; text: string; timeout?: number }) {
            const snackbarPayload: ISnackbarState = {
                show: true,
                color: payload.color,
                text: payload.text,
                timeout: payload.timeout || typeof payload.timeout !== 'undefined' ? payload.timeout : 3000,
            };
            commit('SET_SNACKBAR', snackbarPayload);
        },
        // Add other actions if necessary
    }
};

export default snackbarModule;