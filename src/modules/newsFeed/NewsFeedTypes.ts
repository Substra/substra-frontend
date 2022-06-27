import { TaskCategory } from '@/modules/tasks/TuplesTypes';

export enum NewsItemStatus {
    created = 'STATUS_CREATED',
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    failed = 'STATUS_FAILED',
    canceled = 'STATUS_CANCELED',
}

const NewsItemStatusLabel: Record<NewsItemStatus, string> = {
    STATUS_CREATED: 'created',
    STATUS_DOING: 'doing',
    STATUS_DONE: 'done',
    STATUS_FAILED: 'failed',
    STATUS_CANCELED: 'canceled',
};

export const getNewsItemStatusLabel = (status: NewsItemStatus): string =>
    NewsItemStatusLabel[status];

export enum NewsItemAssetKind {
    computePlan = 'ASSET_COMPUTE_PLAN',
    algo = 'ASSET_ALGO',
    dataset = 'ASSET_DATA_MANAGER',
}

const NewsItemAssetLabel: Record<NewsItemAssetKind, string> = {
    ASSET_COMPUTE_PLAN: 'Compute plan',
    ASSET_ALGO: 'Algorithm',
    ASSET_DATA_MANAGER: 'Dataset',
};

export const getNewsItemAssetLabel = (asset_kind: NewsItemAssetKind): string =>
    NewsItemAssetLabel[asset_kind];

export interface NewsItemType {
    asset_kind: NewsItemAssetKind;
    asset_key: string;
    name: string;
    status: NewsItemStatus;
    timestamp: string;
    detail: {
        task_category: TaskCategory;
        first_failed_task_key?: string;
    };
}
