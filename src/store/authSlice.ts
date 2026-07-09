import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
    id: string;
    name: string;
    email: string;
};

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    isLoading: boolean;
    hasOnboarded: boolean;
};

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    hasOnboarded: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },

        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.isLoading = false;
        },

        completeOnboarding: (state) => {
            state.isAuthenticated = true;
            state.hasOnboarded = true;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    logout,
    completeOnboarding,
} = authSlice.actions;

export default authSlice.reducer;