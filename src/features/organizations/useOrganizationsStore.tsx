import axios from 'axios';
import { create } from 'zustand';

import { listOrganizations } from '@/api/OrganizationsApi';
import { OrganizationT } from '@/types/OrganizationsTypes';

type OrganizationsStateT = {
    organizations: OrganizationT[];
    fetchingOrganizations: boolean;
    fetchOrganizations: () => void;
};

let fetchController: AbortController | undefined;

const useOrganizationsStore = create<OrganizationsStateT>((set) => ({
    organizations: [],
    fetchingOrganizations: true,
    fetchOrganizations: async () => {
        // abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();
        set({ fetchingOrganizations: true });
        try {
            const response = await listOrganizations();
            set({
                fetchingOrganizations: false,
                organizations: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingOrganizations: false });
            }
        }
    },
}));

export default useOrganizationsStore;
