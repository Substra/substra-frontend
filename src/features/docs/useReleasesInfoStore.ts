import { create } from 'zustand';

import { retrieveSubstraReleases } from '@/api/DocsApi';
import { ReleasesInfoT } from '@/types/DocsTypes';

type ReleasesInfoStateT = {
    info: ReleasesInfoT | null;

    fetchingInfo: boolean;

    fetchInfo: () => void;
};

const useReleasesInfoStore = create<ReleasesInfoStateT>((set) => ({
    info: null,
    fetchingInfo: true,

    fetchInfo: async () => {
        set({ fetchingInfo: true });
        try {
            const response = await retrieveSubstraReleases();
            set({
                fetchingInfo: false,
                info: response.data,
            });
        } catch (error) {
            console.warn(error);
            set({ fetchingInfo: false });
        }
    },
}));

export default useReleasesInfoStore;
