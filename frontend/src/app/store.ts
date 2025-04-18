import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/app/slices/authSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        // events: eventsReducer,
        // user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
