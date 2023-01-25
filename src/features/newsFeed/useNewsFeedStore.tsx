import axios from 'axios';
import { create } from 'zustand';

import { listNewsFeed } from '@/api/NewsFeedApi';
import { NewsItemT } from '@/types/NewsFeedTypes';

export const NEWS_FEED_PAGE_SIZE = 10;

type ListNewsFeedArgsT = {
    firstPage: boolean;
    timestamp_before?: string;
};

type NewsFeedStateT = {
    news: NewsItemT[];
    newsFeedCurrentPage: number;
    newsCount: number;
    unseenNewsCount: number;

    fetchingNews: boolean;
    fetchingUnseenNewsCount: boolean;

    fetchNews: ({ firstPage, timestamp_before }: ListNewsFeedArgsT) => void;
    fetchUnseenNewsCount: (timestamp_after: string) => void;
};

let fetchNewsController: AbortController | undefined;
let fetchUnseenNewsCountController: AbortController | undefined;

const useNewsFeedStore = create<NewsFeedStateT>((set) => ({
    news: [],
    newsFeedCurrentPage: 1,
    newsCount: 0,
    unseenNewsCount: 0,
    fetchingNews: false,
    fetchingUnseenNewsCount: false,
    fetchNews: async ({ firstPage, timestamp_before }: ListNewsFeedArgsT) => {
        // abort previous call
        if (fetchNewsController) {
            fetchNewsController.abort();
        }

        fetchNewsController = new AbortController();
        set((state) => ({
            fetchingNews: true,
            news: firstPage ? [] : state.news,
        }));
        try {
            const page = firstPage
                ? 1
                : useNewsFeedStore.getState().newsFeedCurrentPage;
            const response = await listNewsFeed(
                {
                    page,
                    pageSize: NEWS_FEED_PAGE_SIZE,
                    timestamp_before,
                },
                {
                    signal: fetchNewsController.signal,
                }
            );
            set((state) => ({
                fetchingNews: false,
                // !response.data.previous = fetched the first page, else fetched a subsequent page
                news: !response.data.previous
                    ? response.data.results
                    : [...state.news, ...response.data.results],
                newsCount: response.data.count,
                newsFeedCurrentPage: firstPage
                    ? 1
                    : state.newsFeedCurrentPage + 1,
            }));
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingNews: false });
            }
        }
    },
    fetchUnseenNewsCount: async (timestamp_after: string) => {
        // abort previous call
        if (fetchUnseenNewsCountController) {
            fetchUnseenNewsCountController.abort();
        }

        fetchUnseenNewsCountController = new AbortController();
        set({ fetchingUnseenNewsCount: true });
        try {
            const response = await listNewsFeed(
                {
                    pageSize: 0,
                    timestamp_after,
                },
                {
                    signal: fetchUnseenNewsCountController.signal,
                }
            );
            set({
                fetchingUnseenNewsCount: false,
                unseenNewsCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingUnseenNewsCount: false });
            }
        }
    },
}));

export default useNewsFeedStore;
