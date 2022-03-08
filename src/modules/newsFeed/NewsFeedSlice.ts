import * as NewsFeedApi from './NewsFeedApi';
import { NewsItemType } from './NewsFeedTypes';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

interface NewsFeedState {
    newsFeed: NewsItemType[];
    newsFeedLoading: boolean;
    newsFeedError: string;
}

const initialState: NewsFeedState = {
    newsFeed: [],
    newsFeedLoading: true,
    newsFeedError: '',
};

export const listNewsFeed = createAsyncThunk<
    PaginatedApiResponse<NewsItemType>,
    void,
    { rejectValue: string }
>('newsFeed/list', async (_, thunkAPI) => {
    try {
        const response = await NewsFeedApi.listNewsFeed({
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const newsFeedSlice = createSlice({
    name: 'newsFeed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listNewsFeed.pending, (state) => {
                state.newsFeedLoading = true;
                state.newsFeedError = '';
            })
            .addCase(listNewsFeed.fulfilled, (state, { payload }) => {
                state.newsFeed = payload.results;
                state.newsFeedLoading = false;
                state.newsFeedError = '';
            })
            .addCase(listNewsFeed.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.newsFeedLoading = false;
                    state.newsFeedError = payload || 'Unknown error';
                }
            });
    },
});

export default newsFeedSlice.reducer;
