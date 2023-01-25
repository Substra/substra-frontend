import { AxiosError } from 'axios';
import Cookies from 'universal-cookie';
import { create } from 'zustand';

import {
    LoginDataT,
    LoginPayloadT,
    getLogOut,
    postLogIn,
    refreshToken,
    retrieveInfo,
} from '@/api/MeApi';
import { MeInfoT } from '@/types/MeTypes';
import { UserRolesT } from '@/types/UsersTypes';

type AuthStateT = {
    loginData: LoginDataT;
    authenticated: boolean;
    expiration: number | null;
    info: MeInfoT;

    postingLogin: boolean;
    postingRefresh: boolean;
    fetchingInfo: boolean;

    loginError: string;

    postLogin: (credentials: LoginPayloadT) => Promise<LoginDataT | null>;
    postRefresh: () => Promise<LoginDataT | null>;
    fetchInfo: (withCredentials: boolean) => void;
    fetchLogout: () => Promise<unknown>;
};

const emptyLoginData = {
    exp: 0,
    user_id: 0,
    jti: '',
    token_type: '',
};

const defaultInfo = {
    host: API_URL,
    organization_id: '',
    config: {},
    user: '',
    user_role: UserRolesT.user,
    auth: {},
};

const useAuthStore = create<AuthStateT>((set) => ({
    loginData: emptyLoginData,
    authenticated: false,
    /**
     * expiration is a timestamp.
     *
     * It cannot be stored in the state as a Date object because Date objects are mutable and non
     * serializable.
     */
    expiration: null,
    info: defaultInfo,
    postingLogin: false,
    postingRefresh: false,
    fetchingInfo: false,
    loginError: '',
    postLogin: async (credentials: LoginPayloadT) => {
        try {
            const response = await postLogIn(credentials);
            set({
                authenticated: true,
                loginData: response.data,
                expiration: response.data.exp,
            });
            return response.data;
        } catch (error) {
            console.warn(error);
            if (error instanceof AxiosError) {
                const data = error.response?.data;
                let msg;
                if (typeof data === 'object' && data.detail) {
                    msg = data.detail;
                } else {
                    msg = JSON.stringify(data);
                }
                set({ loginError: msg });
            }
            return null;
        }
    },
    postRefresh: async () => {
        set({ postingRefresh: true });
        try {
            const response = await refreshToken();
            set({
                postingRefresh: false,
                authenticated: true,
                loginData: response.data,
                expiration: response.data.exp,
            });
            return response.data;
        } catch (error) {
            console.warn(error);
            set({
                postingRefresh: true,
                authenticated: false,
            });
            return null;
        }
    },
    fetchInfo: async (withCredentials: boolean) => {
        set({ fetchingInfo: true });
        try {
            const response = await retrieveInfo(withCredentials);
            set({
                fetchingInfo: false,
                info: response.data,
            });
        } catch (error) {
            console.warn(error);
            set({ fetchingInfo: false });
        }
    },
    fetchLogout: async () => {
        // clean cookies
        const cookies = new Cookies();
        cookies.remove('header.payload');
        cookies.remove('signature');
        cookies.remove('refresh');

        set({ authenticated: false });
        try {
            const response = await getLogOut();
            set((state) => ({
                info: {
                    ...state.info,
                    version: undefined,
                    channel: undefined,
                    config: {
                        ...state.info.config,
                        model_export_enabled: undefined,
                    },
                },
            }));
            return response.data;
        } catch (error) {
            console.warn(error);
            return null;
        }
    },
}));

export default useAuthStore;
