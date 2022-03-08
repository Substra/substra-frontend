import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import algosSlice from '@/modules/algos/AlgosSlice';
import computePlansSlice from '@/modules/computePlans/ComputePlansSlice';
import datasetsSlice from '@/modules/datasets/DatasetsSlice';
import metricsSlice from '@/modules/metrics/MetricsSlice';
import newsFeedSlice from '@/modules/newsFeed/NewsFeedSlice';
import nodesSlice from '@/modules/nodes/NodesSlice';
import seriesSlice from '@/modules/series/SeriesSlice';
import tasksSlice from '@/modules/tasks/TasksSlice';
import uiSlice from '@/modules/ui/UISlice';
import userSlice from '@/modules/user/UserSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        datasets: datasetsSlice,
        computePlans: computePlansSlice,
        nodes: nodesSlice,
        newsFeed: newsFeedSlice,
        algos: algosSlice,
        metrics: metricsSlice,
        ui: uiSlice,
        tasks: tasksSlice,
        series: seriesSlice,
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
