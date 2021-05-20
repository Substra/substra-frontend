import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/modules/user/UserSlice';

export const store = configureStore({
    reducer: {
        user: userSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
