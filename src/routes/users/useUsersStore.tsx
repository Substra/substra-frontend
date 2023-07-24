import axios from 'axios';
import { create } from 'zustand';

import {
    createUser,
    deleteUser,
    listUsers,
    listUsersAwaitingApproval,
    retrieveUser,
    updateUser,
    deleteUserAwaitingApproval,
    approveUserAwaitingApproval,
} from '@/api/UsersApi';
import { handleUnknownError, withAbortSignal } from '@/api/request';
import { APIListArgsT, AbortFunctionT } from '@/types/CommonTypes';
import {
    UserT,
    UpdateUserPayloadT,
    UserPayloadT,
    UserApprovalPayloadT,
} from '@/types/UsersTypes';

type UsersStateT = {
    users: UserT[];
    usersAwaitingApproval: UserT[];
    usersCount: number;
    usersAwaitingApprovalCount: number;
    user: UserT | null;
    userAwaitingApproval: UserT | null;

    fetchingUsers: boolean;
    fetchingUsersAwaitingApproval: boolean;
    fetchingUser: boolean;
    creatingUser: boolean;
    updatingUser: boolean;
    approvingUserAwaitingApproval: boolean;
    deletingUser: boolean;
    deletingUserAwaitingApproval: boolean;

    fetchUsers: (params: APIListArgsT) => AbortFunctionT;
    fetchUsersAwaitingApproval: () => AbortFunctionT;
    fetchUser: (key: string) => Promise<UserT | null>;
    createUser: (payload: UserPayloadT) => Promise<string | null>;
    updateUser: (
        key: string,
        payload: UpdateUserPayloadT
    ) => Promise<string | null>;
    approveUserAwaitingApproval: (
        key: string,
        payload: UserApprovalPayloadT
    ) => Promise<string | null>;
    deleteUser: (key: string) => Promise<string | null>;
    deleteUserAwaitingApproval: (key: string) => Promise<string | null>;
};

let fetchUserController: AbortController | null;

const useUsersStore = create<UsersStateT>((set, get) => ({
    users: [],
    usersAwaitingApproval: [],
    usersCount: 0,
    usersAwaitingApprovalCount: 0,
    user: null,
    userAwaitingApproval: null,
    fetchingUsers: true,
    fetchingUsersAwaitingApproval: true,
    fetchingUser: true,
    creatingUser: false,
    updatingUser: false,
    approvingUserAwaitingApproval: false,
    deletingUser: false,
    deletingUserAwaitingApproval: false,
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
    fetchUsersAwaitingApproval: withAbortSignal(async (signal) => {
        set({ fetchingUsersAwaitingApproval: true });
        try {
            const response = await listUsersAwaitingApproval({ signal });
            set({
                fetchingUsersAwaitingApproval: false,
                usersAwaitingApproval: response.data.results,
                usersAwaitingApprovalCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingUsersAwaitingApproval: false });
            }
        }
    }),
    fetchUser: async (key: string) => {
        // abort previous call
        if (fetchUserController) {
            fetchUserController.abort();
        }

        fetchUserController = new AbortController();
        set({ fetchingUser: true, user: null });
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
                users: get().users.map((user) => {
                    if (user.username === key) {
                        return response.data;
                    }
                    return user;
                }),
            });
            return null;
        } catch (error) {
            set({ updatingUser: false });
            return handleUnknownError(error);
        }
    },
    approveUserAwaitingApproval: async (
        key: string,
        payload: UserApprovalPayloadT
    ) => {
        set({ approvingUserAwaitingApproval: true });
        try {
            const response = await approveUserAwaitingApproval(key, payload);
            set({
                usersAwaitingApprovalCount:
                    get().usersAwaitingApprovalCount - 1,
                approvingUserAwaitingApproval: false,
                usersAwaitingApproval: get().usersAwaitingApproval.map((user) =>
                    user.username === key ? response.data : user
                ),
            });
            return null;
        } catch (error) {
            set({ approvingUserAwaitingApproval: false });
            return handleUnknownError(error);
        }
    },
    deleteUser: async (key: string) => {
        set({ deletingUser: true });
        try {
            await deleteUser(key);
            set({ deletingUser: false });
            return null;
        } catch (error) {
            set({ deletingUser: false });
            return handleUnknownError(error);
        }
    },
    deleteUserAwaitingApproval: async (key: string) => {
        set({ deletingUserAwaitingApproval: true });
        try {
            await deleteUserAwaitingApproval(key);
            set({
                deletingUserAwaitingApproval: false,
            });
            return null;
        } catch (error) {
            return handleUnknownError(error);
        }
    },
}));

export default useUsersStore;
