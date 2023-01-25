import axios from 'axios';
import { create } from 'zustand';

import { listDatasets } from '@/api/DatasetsApi';
import { APIListArgsT } from '@/types/CommonTypes';
import { DatasetStubT } from '@/types/DatasetTypes';

type DatasetsStateT = {
    datasets: DatasetStubT[];
    datasetsCount: number;
    fetchingDatasets: boolean;
    fetchDatasets: (params: APIListArgsT) => void;
};

let fetchController: AbortController | undefined;

const useDatasetsStore = create<DatasetsStateT>((set) => ({
    datasets: [],
    datasetsCount: 0,
    fetchingDatasets: true,
    fetchDatasets: async (params: APIListArgsT) => {
        // abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();
        set({ fetchingDatasets: true });
        try {
            const response = await listDatasets(params, {
                signal: fetchController.signal,
            });
            set({
                fetchingDatasets: false,
                datasets: response.data.results,
                datasetsCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingDatasets: false });
            }
        }
    },
}));
export default useDatasetsStore;
