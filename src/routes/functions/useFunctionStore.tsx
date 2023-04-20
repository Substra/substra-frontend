import axios from 'axios';
import { create } from 'zustand';

import { retrieveDescription } from '@/api/CommonApi';
import { retrieveFunction, updateFunction } from '@/api/FunctionsApi';
import { handleUnknownError } from '@/libs/utils';
import { FunctionT } from '@/types/FunctionsTypes';

type FunctionStateT = {
    function: FunctionT | null;
    description: string;

    fetchingFunction: boolean;
    fetchingDescription: boolean;
    updatingFunction: boolean;

    fetchFunction: (key: string) => Promise<FunctionT | null>;
    fetchDescription: (url: string) => void;
    updateFunction: (key: string, name: string) => Promise<string | null>;
};

let fetchFunctionController: AbortController | undefined;
let fetchDescriptionController: AbortController | undefined;

const useFunctionStore = create<FunctionStateT>((set) => ({
    function: null,
    description: '',
    fetchingFunction: false,
    fetchingDescription: false,
    updatingFunction: false,
    fetchFunction: async (key: string) => {
        // abort previous call
        if (fetchFunctionController) {
            fetchFunctionController.abort();
        }

        fetchFunctionController = new AbortController();
        set({ fetchingFunction: true, function: null });
        try {
            const response = await retrieveFunction(key, {
                signal: fetchFunctionController.signal,
            });
            set({
                fetchingFunction: false,
                function: response.data,
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingFunction: false });
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
                // do nothing, call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingDescription: false });
            }
            return null;
        }
    },
    updateFunction: async (key: string, name: string) => {
        set({ updatingFunction: true });
        try {
            const response = await updateFunction(key, { name }, {});
            set({
                updatingFunction: false,
                function: response.data,
            });
            return null;
        } catch (error) {
            set({ updatingFunction: false });
            return handleUnknownError(error);
        }
    },
}));

export default useFunctionStore;
