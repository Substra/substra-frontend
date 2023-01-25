import { FileT, PermissionsT } from '@/types/CommonTypes';

export type ModelT = {
    key: string;
    compute_task_key: string;
    owner: string;
    creation_date: string;
    address?: FileT;
    permissions?: PermissionsT;
};

export const isModelT = (model: unknown): model is ModelT => {
    if (typeof model !== 'object') {
        return false;
    }

    return (
        (model as ModelT).key !== undefined &&
        (model as ModelT).compute_task_key !== undefined &&
        (model as ModelT).owner !== undefined &&
        (model as ModelT).creation_date !== undefined
    );
};
