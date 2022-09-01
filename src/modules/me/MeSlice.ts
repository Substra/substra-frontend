import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import Cookies from 'universal-cookie';

import {
    postLogIn,
    LoginPayloadT,
    LoginDataT,
    refreshToken as getRefreshToken,
    getLogOut,
    retrieveInfo as getInfo,
} from '@/modules/me/MeApi';
import { UserRolesT } from '@/modules/users/UsersTypes';

import { MeInfoT } from './MeTypes';

type MeStateT = {
    authenticated: boolean;
    error: string;
    loading: boolean;
    refreshLoading: boolean;
    expiration: number | null;
    payload: LoginDataT;

    info: MeInfoT;
    infoLoading: boolean;
    infoError: string;
};

type LoginErrorT = {
    detail: string;
};
const defaultPayload = {
    exp: 0,
    user_id: 0,
    jti: '',
    token_type: '',
};

const initialState: MeStateT = {
    authenticated: false,
    error: '',
    loading: false,
    refreshLoading: false,
    /**
     * expiration is a timestamp, it can be fetched as a date using the following selector:
     *
     * const expiration = useAppSelector((state) => new Date(state.me.expiration * 1000);
     *
     * It cannot be stored in the state as a Date object because Date objects are mutable and non
     * serializable.
     */
    expiration: null,
    payload: defaultPayload,

    info: {
        host: API_URL,
        organization_id: '',
        config: {},
        user: '',
        user_role: UserRolesT.user,
    },
    infoLoading: false,
    infoError: '',
};

export const logIn = createAsyncThunk<
    LoginDataT,
    LoginPayloadT,
    {
        rejectValue: LoginErrorT;
    }
>('ME_LOGIN', async (payload, thunkAPI) => {
    try {
        const response = await postLogIn(payload);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const logOut = createAsyncThunk('ME_LOGOUT', async (_, thunkAPI) => {
    // clean cookies
    const cookies = new Cookies();
    cookies.remove('header.payload');
    cookies.remove('signature');
    cookies.remove('refresh');

    try {
        const response = await getLogOut();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const refreshToken = createAsyncThunk<
    LoginDataT,
    void,
    { rejectValue: LoginErrorT }
>('ME_REFRESH_TOKEN', async (_, thunkAPI) => {
    try {
        const response = await getRefreshToken();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveInfo = createAsyncThunk<
    MeInfoT,
    boolean,
    { rejectValue: string }
>('ME_INFO', async (withCredentials, thunkAPI) => {
    try {
        const response = await getInfo(withCredentials);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

const meSlice = createSlice({
    name: 'me',
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
            .addCase(logOut.pending, (state) => {
                state.authenticated = false;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.info.version = undefined;
                state.info.channel = undefined;
                state.info.config.model_export_enabled = undefined;
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
            })
            .addCase(retrieveInfo.pending, (state) => {
                state.infoLoading = true;
                state.infoError = '';
            })
            .addCase(retrieveInfo.fulfilled, (state, { payload }) => {
                state.infoLoading = false;
                state.infoError = '';
                state.info = payload;
            })
            .addCase(retrieveInfo.rejected, (state, { payload }) => {
                state.infoLoading = false;
                state.infoError = payload || 'Unknown error';
            });
    },
});

export default meSlice.reducer;
