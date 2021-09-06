import { FileT, PermissionsType } from '@/modules/common/CommonTypes';

export enum ModelCategory {
    simple = 'MODEL_SIMPLE',
    head = 'MODEL_HEAD',
}

export interface Model {
    key: string;
    category: ModelCategory;
    compute_task_key: string;
    address: FileT;
    permissions: PermissionsType;
    owner: string;
}
