import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import algosSlice from '@/modules/algos/AlgosSlice';
import compareSlice from '@/modules/computePlans/CompareSlice';
import computePlansSlice from '@/modules/computePlans/ComputePlansSlice';
import cpWorkflowSlice from '@/modules/cpWorkflow/CPWorkflowSlice';
import datasetsSlice from '@/modules/datasets/DatasetsSlice';
import metadataSlice from '@/modules/metadata/MetadataSlice';
import newsFeedSlice from '@/modules/newsFeed/NewsFeedSlice';
import organizationsSlice from '@/modules/organizations/OrganizationsSlice';
import seriesSlice from '@/modules/series/SeriesSlice';
import tasksSlice from '@/modules/tasks/TasksSlice';
import userSlice from '@/modules/user/UserSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
        datasets: datasetsSlice,
        computePlans: computePlansSlice,
        compare: compareSlice,
        organizations: organizationsSlice,
        newsFeed: newsFeedSlice,
        algos: algosSlice,
        tasks: tasksSlice,
        series: seriesSlice,
        metadata: metadataSlice,
        cpWorkflow: cpWorkflowSlice,
    },
});

interface StoreProviderProps {
    children: React.ReactNode;
}
export const StoreProvider = ({
    children,
}: StoreProviderProps): JSX.Element => (
    <Provider store={store} children={children} />
);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
