import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import userSlice from '@/modules/user/UserSlice';
import datasetsSlice from '@/modules/datasets/DatasetsSlice';
import computePlansSlice from '@/modules/computePlans/ComputePlansSlice';
import nodesSlice from '@/modules/nodes/NodesSlice';
import algosSlice from '@/modules/algos/AlgosSlice';
import metricsSlice from '@/modules/metrics/MetricsSlice';
import uiSlice from '@/modules/ui/UISlice';
import tasksSlice from '@/modules/tasks/TasksSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        datasets: datasetsSlice,
        computePlans: computePlansSlice,
        nodes: nodesSlice,
        algos: algosSlice,
        metrics: metricsSlice,
        ui: uiSlice,
        tasks: tasksSlice,
    },
});

export interface StoreProviderProps {
    children: React.ReactNode;
}
export const StoreProvider = ({
    children,
}: StoreProviderProps): JSX.Element => (
    <Provider store={store} children={children} />
);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
