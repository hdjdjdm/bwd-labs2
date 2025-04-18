import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@app/slices/authSlice.ts';
import eventsSlice from '@app/slices/eventsSlice.ts';
import uiSlice from '@app/slices/uiSlice.ts';
import userSlice from '@app/slices/userSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        events: eventsSlice,
        user: userSlice,
        ui: uiSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
