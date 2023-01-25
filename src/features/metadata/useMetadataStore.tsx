import axios from 'axios';
import { create } from 'zustand';

import { listMetadata } from '@/api/MetadataApi';

type MetadataStateT = {
    metadata: string[];
    fetchingMetadata: boolean;
    fetchMetadata: () => void;
};

let fetchController: AbortController | undefined;

const useMetadataStore = create<MetadataStateT>((set) => ({
    metadata: [],
    fetchingMetadata: false,
    fetchMetadata: async () => {
        // abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();
        set({ fetchingMetadata: true });
        try {
            const response = await listMetadata();
            set({
                fetchingMetadata: false,
                metadata: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingMetadata: false });
            }
        }
    },
}));

export default useMetadataStore;
