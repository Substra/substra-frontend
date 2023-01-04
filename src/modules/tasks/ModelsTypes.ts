import { FileT, PermissionsT } from '@/modules/common/CommonTypes';

export type ModelT = {
    key: string;
    compute_task_key: string;
    owner: string;
    creation_date: string;
    address?: FileT;
    permissions?: PermissionsT;
};
