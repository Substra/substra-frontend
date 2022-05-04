import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import * as NewsFeedApi from './NewsFeedApi';
import { NewsItemType } from './NewsFeedTypes';

interface NewsFeedState {
    items: NewsItemType[];
    count: number;
    currentPage: number;
    isLastPage: boolean;
    loading: boolean;
    error: string;
}

const initialState: NewsFeedState = {
    items: [],
    count: 0,
    loading: true,
    currentPage: 1,
    isLastPage: false,
    error: '',
};

export const NEWS_FEED_PAGE_SIZE = 10;

export const listNewsFeed = createAsyncThunk<
    PaginatedApiResponse<NewsItemType>,
    { firstPage: boolean },
    { rejectValue: string }
>('newsFeed/list', async ({ firstPage }, thunkAPI) => {
    const state = thunkAPI.getState() as { newsFeed: NewsFeedState };
    const page = firstPage ? 1 : state.newsFeed.currentPage;
    try {
        const response = await NewsFeedApi.listNewsFeed(
            { page: page, pageSize: NEWS_FEED_PAGE_SIZE },
            {
                signal: thunkAPI.signal,
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

const newsFeedSlice = createSlice({
    name: 'newsFeed',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listNewsFeed.pending, (state, { meta }) => {
                state.currentPage = meta.arg.firstPage
                    ? 1
                    : state.currentPage + 1;
                state.items = meta.arg.firstPage ? [] : state.items;
                state.loading = true;
                state.error = '';
            })
            .addCase(listNewsFeed.fulfilled, (state, { payload }) => {
                if (!payload.previous) {
                    // fetched the first page
                    state.items = payload.results;
                } else {
                    // fetched a subsequent page
                    state.items = [...state.items, ...payload.results];
                }
                state.count = payload.count;
                state.isLastPage = !payload.next;
                state.loading = false;
                state.error = '';
            })
            .addCase(listNewsFeed.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.loading = false;
                    state.error = payload || 'Unknown error';
                }
            });
    },
});

export default newsFeedSlice.reducer;
