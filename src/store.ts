import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/modules/user/UserSlice';
import datasetsSlice from '@/modules/datasets/DatasetsSlice';
import computePlansSlice from '@/modules/computePlans/ComputePlansSlice';
import nodesSlice from '@/modules/nodes/NodesSlice';

export const store = configureStore({
    reducer: {
        user: userSlice,
        datasets: datasetsSlice,
        computePlans: computePlansSlice,
        nodes: nodesSlice,
    },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
