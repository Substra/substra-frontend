import { TaskCategory } from '@/modules/tasks/TuplesTypes';

export enum NewsItemStatus {
    created = 'STATUS_CREATED',
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    failed = 'STATUS_FAILED',
    canceled = 'STATUS_CANCELED',
}

// This order is the one defined in the backend
enum TaskCategoryNumber {
    train = 1,
    aggregate = 2,
    composite = 3,
    test = 4,
}

export const taskCategoryByCategoryNumber: Record<
    TaskCategoryNumber,
    TaskCategory
> = {
    [TaskCategoryNumber.train]: TaskCategory.train,
    [TaskCategoryNumber.test]: TaskCategory.test,
    [TaskCategoryNumber.composite]: TaskCategory.composite,
    [TaskCategoryNumber.aggregate]: TaskCategory.aggregate,
};

export type NewsItemAssetKind =
    | 'ASSET_COMPUTE_PLAN'
    | 'ASSET_ALGO'
    | 'ASSET_METRIC'
    | 'ASSET_DATA_MANAGER';

export interface NewsItemType {
    asset_kind: NewsItemAssetKind;
    asset_key: string;
    name: string;
    status: NewsItemStatus;
    timestamp: string;
    detail: {
        task_category: TaskCategoryNumber;
        first_failed_task_key?: string;
    };
}
