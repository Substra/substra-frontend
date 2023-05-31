import axios from 'axios';
import { create } from 'zustand';

import {
    createUser,
    deleteUser,
    listUsers,
    retrieveUser,
    updateUser,
} from '@/api/UsersApi';
import { handleUnknownError, withAbortSignal } from '@/api/request';
import { APIListArgsT, AbortFunctionT } from '@/types/CommonTypes';
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

    fetchUsers: (params: APIListArgsT) => AbortFunctionT;
    fetchUser: (key: string) => Promise<UserT | null>;
    createUser: (payload: UserPayloadT) => Promise<string | null>;
    updateUser: (
        key: string,
        payload: UpdateUserPayloadT
    ) => Promise<string | null>;
    deleteUser: (key: string) => Promise<string | null>;
};

let fetchUserController: AbortController | null;

const useUsersStore = create<UsersStateT>((set, get) => ({
    users: [],
    usersCount: 0,
    user: null,
    fetchingUsers: true,
    fetchingUser: true,
    creatingUser: false,
    updatingUser: false,
    deletingUser: false,
    fetchUsers: withAbortSignal(async (signal, params) => {
        set({ fetchingUsers: true });
        try {
            const response = await listUsers(params, {
                signal,
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
    }),
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
            set({
                creatingUser: false,
                user: response.data,
                users: get().users.concat(response.data),
            });
            return null;
        } catch (error) {
            set({ creatingUser: false });
            return handleUnknownError(error);
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
            return handleUnknownError(error);
        }
    },
    deleteUser: async (key: string) => {
        set({ deletingUser: true });
        try {
            await deleteUser(key);
            set({
                deletingUser: false,
                usersCount: get().usersCount - 1,
                users: get().users.filter(
                    (user) => user.username !== get().user?.username
                ),
            });
            return null;
        } catch (error) {
            set({ updatingUser: false });
            return handleUnknownError(error);
        }
    },
}));

export default useUsersStore;
