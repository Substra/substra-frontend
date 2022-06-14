import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import { RootState } from '@/store';

import * as NewsFeedApi from './NewsFeedApi';
import { NewsItemType } from './NewsFeedTypes';

interface NewsFeedState {
    items: NewsItemType[];
    count: number;
    currentPage: number;
    loading: boolean;
    error: string;

    // Number of unseen news since the last time user opened the news feed
    actualizedCount: number;
    actualizedCountLoading: boolean;
    actualizedCountError: string;
}

const initialState: NewsFeedState = {
    items: [],
    count: 0,
    loading: true,
    currentPage: 1,
    error: '',

    actualizedCount: 0,
    actualizedCountLoading: true,
    actualizedCountError: '',
};

export const NEWS_FEED_PAGE_SIZE = 10;

type listNewsFeedArgsT = {
    firstPage: boolean;
    timestamp_before?: string;
};
export const listNewsFeed = createAsyncThunk<
    PaginatedApiResponse<NewsItemType>,
    listNewsFeedArgsT,
    { rejectValue: string }
>(
    'newsFeed/list',
    async ({ firstPage, timestamp_before }: listNewsFeedArgsT, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const page = firstPage ? 1 : state.newsFeed.currentPage;

        try {
            const response = await NewsFeedApi.listNewsFeed(
                {
                    page,
                    pageSize: NEWS_FEED_PAGE_SIZE,
                    timestamp_before,
                },
                {
                    signal: thunkAPI.signal,
                }
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveActualizedCount = createAsyncThunk<
    PaginatedApiResponse<NewsItemType>,
    { timestamp_after: string },
    { rejectValue: string }
>('newsFeed/actualizedCount', async ({ timestamp_after }, thunkAPI) => {
    try {
        const response = await NewsFeedApi.listNewsFeed(
            { pageSize: 0, timestamp_after },
            {
                signal: thunkAPI.signal,
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
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
                state.loading = false;
                state.error = '';
            })
            .addCase(listNewsFeed.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.loading = false;
                    state.error = payload || 'Unknown error';
                }
                state.currentPage = state.currentPage - 1;
            })
            .addCase(retrieveActualizedCount.pending, (state) => {
                state.actualizedCountLoading = true;
                state.actualizedCountError = '';
            })
            .addCase(
                retrieveActualizedCount.fulfilled,
                (state, { payload }) => {
                    state.actualizedCount = payload.count;
                    state.actualizedCountLoading = false;
                    state.actualizedCountError = '';
                }
            )
            .addCase(retrieveActualizedCount.rejected, (state, { payload }) => {
                state.actualizedCountLoading = false;
                state.actualizedCountError = payload || 'Unknown error';
            });
    },
});

export default newsFeedSlice.reducer;
