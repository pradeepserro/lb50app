import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import questionnaireReducer from '@/store/questionnaireSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    persistReducer,
    persistStore,
} from 'redux-persist';

const persistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: ['isAuthenticated', 'token', 'user'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        questionnaire: questionnaireReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // required for redux-persist
        }),
});

export const persistor = persistStore(store);

// Types (keep these)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;