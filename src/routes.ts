import { FC } from 'react';
import Algos from '@/routes/algos/Algos';
import ComputePlan from '@/routes/computePlan/ComputePlan';
import Datasets from '@/routes/datasets/Datasets';
import Login from '@/routes/login/Login';
import { useRoute } from 'wouter';

export interface IRoute {
    path: string;
    component: FC;
}

export const PATHS = {
    LOGIN: '/login/',
    COMPUTE_PLANS: '/compute_plans/',
    DATASETS: '/datasets/',
    DATASET: '/datasets/:key/',
    ALGOS: '/algorithms/',
    ALGO: '/algorithms/:key/',
};

export const ROUTES: { [key: string]: IRoute } = {
    LOGIN: {
        path: PATHS.LOGIN,
        component: Login,
    },
    COMPUTE_PLANS: {
        path: PATHS.COMPUTE_PLANS,
        component: ComputePlan,
    },
    DATASETS: {
        // the following path matches both PATHS.DATASETS and PATHS.DATASET
        path: '/datasets/:key?',
        component: Datasets,
    },
    ALGOS: {
        path: '/algorithms/:key?',
        component: Algos,
    },
};

export function compilePath(
    path: string,
    params: { [key: string]: string }
): string {
    let compiledPath = path;
    let paramName, paramValue;
    for ([paramName, paramValue] of Object.entries(params)) {
        compiledPath = compiledPath.replace(
            `:${paramName}`,
            encodeURIComponent(paramValue)
        );
    }
    return compiledPath;
}

export function useKeyFromPath(path: string): string | null {
    const [, params] = useRoute(path);
    if (params && params.key) {
        return params.key;
    }
    return null;
}
