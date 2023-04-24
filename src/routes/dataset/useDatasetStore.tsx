import axios from 'axios';
import { create } from 'zustand';

import { retrieveDescription } from '@/api/CommonApi';
import {
    retrieveDataset,
    retrieveOpener,
    updateDataset,
} from '@/api/DatasetsApi';
import { handleUnknownError } from '@/api/request';
import { DatasetT } from '@/types/DatasetTypes';

type DatasetsStateT = {
    dataset: DatasetT | null;
    description: string;
    opener: string;

    fetchingDataset: boolean;
    fetchingDescription: boolean;
    fetchingOpener: boolean;
    updatingDataset: boolean;

    fetchDataset: (key: string) => Promise<DatasetT | null>;
    fetchDescription: (url: string) => void;
    fetchOpener: (url: string) => void;
    updateDataset: (key: string, name: string) => Promise<string | null>;
};

let fetchDatasetController: AbortController | undefined;
let fetchDescriptionController: AbortController | undefined;
let fetchOpenerController: AbortController | undefined;

const useDatasetStore = create<DatasetsStateT>((set) => ({
    dataset: null,
    description: '',
    opener: '',
    fetchingDataset: true,
    fetchingDescription: true,
    fetchingOpener: true,
    updatingDataset: false,
    fetchDataset: async (key: string): Promise<DatasetT | null> => {
        // abort previous call
        if (fetchDatasetController) {
            fetchDatasetController.abort();
        }

        fetchDatasetController = new AbortController();
        set({ fetchingDataset: true });
        try {
            const response = await retrieveDataset(key, {
                signal: fetchDatasetController.signal,
            });
            set({
                fetchingDataset: false,
                dataset: response.data,
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingDataset: false });
            }
            return null;
        }
    },
    fetchDescription: async (url: string) => {
        // abort previous call
        if (fetchDescriptionController) {
            fetchDescriptionController.abort();
        }

        fetchDescriptionController = new AbortController();
        set({ fetchingDescription: true });
        try {
            const response = await retrieveDescription(url, {
                signal: fetchDescriptionController.signal,
            });
            set({
                fetchingDescription: false,
                description: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingDescription: false });
            }
        }
    },
    fetchOpener: async (url: string) => {
        // abort previous call
        if (fetchOpenerController) {
            fetchOpenerController.abort();
        }

        fetchOpenerController = new AbortController();
        set({ fetchingOpener: true });
        try {
            const response = await retrieveOpener(url, {
                signal: fetchOpenerController.signal,
            });
            set({
                fetchingOpener: false,
                opener: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingOpener: false });
            }
        }
    },
    updateDataset: async (
        key: string,
        name: string
    ): Promise<string | null> => {
        set({ updatingDataset: true });
        try {
            const response = await updateDataset(key, { name }, {});
            set({ updatingDataset: false, dataset: response.data });
            return null;
        } catch (error) {
            set({ updatingDataset: false });
            return handleUnknownError(error);
        }
    },
}));
export default useDatasetStore;
