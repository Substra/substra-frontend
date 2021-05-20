import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import {
    postLogIn,
    loginPayload,
    postLogOut,
    loginData,
} from '@/modules/user/UserApi';

interface UserState {
    authenticated: boolean;
    error: string;
    loading: boolean;
    refreshLoading: boolean;
    init: boolean;
    expiration: Date | null;
    payload: loginData;
}

interface loginError {
    detail: string;
}
const defaultPayload = {
    exp: 0,
    user_id: 0,
    jti: '',
    token_type: '',
};

const initialState: UserState = {
    authenticated: false,
    error: '',
    loading: false,
    refreshLoading: false,
    init: false,
    expiration: null,
    payload: defaultPayload,
};

export const logIn = createAsyncThunk<
    loginData,
    loginPayload,
    {
        rejectValue: loginError;
    }
>('USERS_LOGIN', async (payload, thunkAPI) => {
    try {
        const response: AxiosResponse<loginData> = await postLogIn(payload);
        return response.data;
    } catch (err) {
        const error: AxiosError<loginError> = err;
        if (!error.response) {
            throw err;
        }
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const logOut = createAsyncThunk('USERS_LOGOUT', async () => {
    const response = await postLogOut();
    return response;
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(logIn.pending, (state) => {
                state.loading = true;
                state.authenticated = false;
                state.error = '';
            })
            .addCase(logIn.fulfilled, (state, { payload }) => {
                state.authenticated = true;
                state.init = true;
                state.error = '';
                state.loading = false;
                state.expiration = new Date(payload.exp * 1000);
                state.payload = payload;
            })
            .addCase(logIn.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.detail;
                }
                state.authenticated = false;
                state.init = true;
                state.loading = false;
                state.expiration = new Date();
                state.payload = defaultPayload;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.authenticated = false;
            });
    },
});

export default userSlice.reducer;
