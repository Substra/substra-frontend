import { ModelT } from './ModelsTypes';

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
