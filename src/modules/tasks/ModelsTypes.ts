import { FileT, PermissionsT } from '@/modules/common/CommonTypes';

export type ModelT = {
    key: string;
    compute_task_key: string;
    address?: FileT;
    permissions?: PermissionsT;
    owner: string;
    creation_date: string;
};
