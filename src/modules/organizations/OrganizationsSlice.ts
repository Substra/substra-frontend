import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as OrganizationsAPI from './OrganizationsApi';
import { OrganizationInfoType, OrganizationType } from './OrganizationsTypes';

interface OrganizationsState {
    organizations: OrganizationType[];
    organizationsLoading: boolean;
    organizationsError: string;

    info: OrganizationInfoType;
    infoLoading: boolean;
    infoError: string;
}

const initialState: OrganizationsState = {
    organizations: [],
    organizationsLoading: false,
    organizationsError: '',

    info: {
        host: API_URL,
        organization_id: '',
        config: {},
    },
    infoLoading: false,
    infoError: '',
};

export const listOrganizations = createAsyncThunk<
    OrganizationType[],
    void,
    { rejectValue: string }
>('organizations/list', async (_, thunkAPI) => {
    try {
        const response = await OrganizationsAPI.listOrganizations();
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
    OrganizationInfoType,
    boolean,
    { rejectValue: string }
>('organizations/info', async (withCredentials, thunkAPI) => {
    try {
        const response = await OrganizationsAPI.retrieveInfo(withCredentials);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

const organizationsSlice = createSlice({
    name: 'organizations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listOrganizations.pending, (state) => {
                state.organizationsLoading = true;
                state.organizationsError = '';
            })
            .addCase(listOrganizations.fulfilled, (state, { payload }) => {
                state.organizationsLoading = false;
                state.organizationsError = '';
                state.organizations = payload;
            })
            .addCase(listOrganizations.rejected, (state, { payload }) => {
                state.organizations = [];
                state.organizationsLoading = false;
                state.organizationsError = payload || 'Unknown error';
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
            })
            .addCase('USERS_LOGOUT/fulfilled', (state) => {
                state.info.version = undefined;
                state.info.channel = undefined;
                state.info.config.model_export_enabled = undefined;
            });
    },
});

export default organizationsSlice.reducer;