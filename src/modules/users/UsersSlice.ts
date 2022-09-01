import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import * as UsersApi from './UsersApi';
import { UpdateUserPayloadT, UserPayloadT, UserT } from './UsersTypes';

interface UsersState {
    users: UserT[];
    usersCount: number;
    usersLoading: boolean;
    usersError: string;

    user: UserT | null;
    userLoading: boolean;
    userError: string;

    deleting: boolean;
}

const initialState: UsersState = {
    users: [],
    usersCount: 0,
    usersLoading: false,
    usersError: '',

    user: null,
    userLoading: false,
    userError: '',

    deleting: false,
};

export const createUser = createAsyncThunk<
    UserT,
    UserPayloadT,
    { rejectValue: string }
>('users/add', async (payload, thunkAPI) => {
    try {
        const response = await UsersApi.createUser(payload);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const listUsers = createAsyncThunk<
    PaginatedApiResponseT<UserT>,
    APIListArgsT,
    { rejectValue: string }
>('users/list', async (params: APIListArgsT, thunkAPI) => {
    try {
        const response = await UsersApi.listUsers(params, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveUser = createAsyncThunk<
    UserT,
    string,
    { rejectValue: string }
>('users/get', async (key: string, thunkAPI) => {
    try {
        const response = await UsersApi.retrieveUser(key, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

interface UpdateUserArgs {
    key: string;
    payload: UpdateUserPayloadT;
}

export const updateUser = createAsyncThunk<
    UserT,
    UpdateUserArgs,
    { rejectValue: string }
>('users/update', async ({ key, payload }, thunkAPI) => {
    try {
        const response = await UsersApi.updateUser(key, payload);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const deleteUser = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>('users/delete', async (key, thunkAPI) => {
    try {
        const response = await UsersApi.deleteUser(key);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listUsers.pending, (state) => {
                state.usersLoading = true;
                state.usersError = '';
            })
            .addCase(listUsers.fulfilled, (state, { payload }) => {
                state.usersLoading = false;
                state.users = payload.results;
                state.usersCount = payload.count;
                state.usersError = '';
            })
            .addCase(listUsers.rejected, (state, { payload }) => {
                state.usersLoading = false;
                state.usersError = payload || 'Unknown error';
                state.users = [];
                state.usersCount = 0;
            })
            .addCase(retrieveUser.pending, (state) => {
                state.userLoading = true;
                state.user = null;
                state.userError = '';
            })
            .addCase(retrieveUser.fulfilled, (state, { payload }) => {
                state.userLoading = false;
                state.userError = '';
                state.user = payload;
            })
            .addCase(retrieveUser.rejected, (state, { payload }) => {
                state.userLoading = false;
                state.userError = payload || 'Unknown error';
            })
            .addCase(createUser.pending, (state) => {
                state.userLoading = false;
                state.userError = '';
                state.user = null;
            })
            .addCase(createUser.fulfilled, (state, { payload }) => {
                state.userLoading = false;
                state.userError = '';
                state.user = payload;
            })
            .addCase(createUser.rejected, (state, { payload }) => {
                state.userLoading = false;
                state.userError = payload || 'Unknown error';
                state.user = null;
            })
            .addCase(updateUser.pending, (state) => {
                state.userLoading = true;
                state.userError = '';
            })
            .addCase(updateUser.fulfilled, (state, { payload }) => {
                state.user = payload;
                state.userLoading = false;
                state.userError = '';
            })
            .addCase(updateUser.rejected, (state, { payload }) => {
                state.userLoading = false;
                state.userError = payload || 'Unknown error';
            })
            .addCase(deleteUser.pending, (state) => {
                state.userLoading = true;
                state.userError = '';
                state.deleting = true;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.userLoading = false;
                state.userError = '';
                state.users = state.users.filter(
                    (user) => user.username !== state.user?.username
                );
                state.usersCount = state.usersCount - 1;
                state.deleting = false;
            })
            .addCase(deleteUser.rejected, (state, { payload }) => {
                state.userLoading = false;
                state.userError = payload || 'Unknown error';
                state.deleting = false;
            });
    },
});

export default usersSlice.reducer;
