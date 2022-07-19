import { FileT, PermissionsT } from '@/modules/common/CommonTypes';

export enum ModelCategory {
    simple = 'MODEL_SIMPLE',
    head = 'MODEL_HEAD',
}

export type ModelT = {
    key: string;
    category: ModelCategory;
    compute_task_key: string;
    address?: FileT;
    permissions: PermissionsT;
    owner: string;
    creation_date: string;
};
