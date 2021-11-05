import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import {
    postLogIn,
    loginPayload,
    loginData,
    refreshToken as getRefreshToken,
    getLogOut,
} from '@/modules/user/UserApi';

interface UserState {
    authenticated: boolean;
    error: string;
    loading: boolean;
    refreshLoading: boolean;
    expiration: number | null;
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
    /**
     * expiration is a timestamp, it can be fetched as a date using the following selector:
     *
     * const expiration = useAppSelector((state) => new Date(state.user.expiration * 1000);
     *
     * It cannot be stored in the state as a Date object because Date objects are mutable and non
     * serializable.
     */
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
        const response = await postLogIn(payload);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const logOut = createAsyncThunk('USERS_LOGOUT', async (_, thunkAPI) => {
    try {
        const response = await getLogOut();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const refreshToken = createAsyncThunk<
    loginData,
    void,
    { rejectValue: loginError }
>('USERS_REFRESH_TOKEN', async (_, thunkAPI) => {
    try {
        const response = await getRefreshToken();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
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
                state.error = '';
                state.loading = false;
                state.expiration = payload.exp;
                state.payload = payload;
            })
            .addCase(logIn.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.detail;
                }
                state.authenticated = false;
                state.loading = false;
                state.expiration = null;
                state.payload = defaultPayload;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.authenticated = false;
            })
            .addCase(refreshToken.pending, (state) => {
                state.refreshLoading = true;
            })
            .addCase(refreshToken.fulfilled, (state, { payload }) => {
                state.refreshLoading = false;
                state.authenticated = true;
                state.expiration = payload.exp;
                state.payload = payload;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.refreshLoading = false;
                state.authenticated = false;
            });
    },
});

export default userSlice.reducer;
