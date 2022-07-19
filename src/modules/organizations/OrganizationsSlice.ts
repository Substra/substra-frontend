import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as OrganizationsAPI from './OrganizationsApi';
import { OrganizationT } from './OrganizationsTypes';

type OrganizationsStateT = {
    organizations: OrganizationT[];
    organizationsLoading: boolean;
    organizationsError: string;
};

const initialState: OrganizationsStateT = {
    organizations: [],
    organizationsLoading: false,
    organizationsError: '',
};

export const listOrganizations = createAsyncThunk<
    OrganizationT[],
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
            });
    },
});

export default organizationsSlice.reducer;
