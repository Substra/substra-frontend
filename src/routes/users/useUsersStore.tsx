import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import {
    createUser,
    deleteUser,
    listUsers,
    retrieveUser,
    updateUser,
} from '@/api/UsersApi';
import { APIListArgsT } from '@/types/CommonTypes';
import { UserT, UpdateUserPayloadT, UserPayloadT } from '@/types/UsersTypes';

type UsersStateT = {
    users: UserT[];
    usersCount: number;
    user: UserT | null;

    fetchingUsers: boolean;
    fetchingUser: boolean;
    creatingUser: boolean;
    updatingUser: boolean;
    deletingUser: boolean;

    fetchUsers: (params: APIListArgsT) => void;
    fetchUser: (key: string) => Promise<UserT | null>;
    createUser: (payload: UserPayloadT) => Promise<unknown>;
    updateUser: (key: string, payload: UpdateUserPayloadT) => Promise<unknown>;
    deleteUser: (key: string) => Promise<unknown>;
};

let fetchUsersController: AbortController | null;
let fetchUserController: AbortController | null;

const useUsersStore = create<UsersStateT>((set) => ({
    users: [],
    usersCount: 0,
    user: null,
    fetchingUsers: false,
    fetchingUser: false,
    creatingUser: false,
    updatingUser: false,
    deletingUser: false,
    fetchUsers: async (params: APIListArgsT) => {
        // abort previous call
        if (fetchUsersController) {
            fetchUsersController.abort();
        }

        fetchUsersController = new AbortController();
        set({ fetchingUsers: true });
        try {
            const response = await listUsers(params, {
                signal: fetchUsersController.signal,
            });
            set({
                fetchingUsers: false,
                users: response.data.results,
                usersCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingUsers: false });
            }
        }
    },
    fetchUser: async (key: string) => {
        // abort previous call
        if (fetchUserController) {
            fetchUserController.abort();
        }

        fetchUserController = new AbortController();
        set({ fetchingUser: true });
        try {
            const response = await retrieveUser(key, {
                signal: fetchUserController.signal,
            });
            set({
                fetchingUser: false,
                user: response.data,
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingUser: false });
            }
            return null;
        }
    },
    createUser: async (payload: UserPayloadT) => {
        set({ creatingUser: true });
        try {
            const response = await createUser(payload);
            set((state) => ({
                creatingUser: false,
                user: response.data,
                users: state.users.concat(response.data),
            }));
            return null;
        } catch (error) {
            set({ creatingUser: false });
            console.warn(error);
            if (error instanceof AxiosError) {
                const data = error.response?.data;
                let msg;
                if (typeof data === 'object' && data.detail) {
                    msg = data.detail;
                } else {
                    msg = JSON.stringify(data);
                }
                return msg;
            }
            return error;
        }
    },
    updateUser: async (key: string, payload: UpdateUserPayloadT) => {
        set({ updatingUser: true });
        try {
            const response = await updateUser(key, payload);
            set({
                updatingUser: false,
                user: response.data,
            });
            return null;
        } catch (error) {
            set({ updatingUser: false });
            console.warn(error);
            if (error instanceof AxiosError) {
                const data = error.response?.data;
                let msg;
                if (typeof data === 'object' && data.detail) {
                    msg = data.detail;
                } else {
                    msg = JSON.stringify(data);
                }
                return msg;
            }
            return error;
        }
    },
    deleteUser: async (key: string) => {
        set({ deletingUser: true });
        try {
            await deleteUser(key);
            set((state) => ({
                deletingUser: false,
                usersCount: state.usersCount - 1,
                users: state.users.filter(
                    (user) => user.username !== state.user?.username
                ),
            }));
            return null;
        } catch (error) {
            set({ updatingUser: false });
            console.warn(error);
            if (error instanceof AxiosError) {
                const data = error.response?.data;
                let msg;
                if (typeof data === 'object' && data.detail) {
                    msg = data.detail;
                } else {
                    msg = JSON.stringify(data);
                }
                return msg;
            }
            return error;
        }
    },
}));

export default useUsersStore;
