import { FC } from 'react';

import { useRoute } from 'wouter';

import Algos from '@/routes/algos/Algos';
import ComputePlan from '@/routes/computePlan/ComputePlan';
import ComputePlanDetails from '@/routes/computePlanDetails/ComputePlanDetails';
import ComputePlans from '@/routes/computePlans/ComputePlans';
import Datasets from '@/routes/datasets/Datasets';
import Home from '@/routes/home/Home';
import Login from '@/routes/login/Login';
import Metrics from '@/routes/metrics/Metrics';
import Tasks from '@/routes/tasks/Tasks';

export interface IRoute {
    path: string;
    component: FC;
}

export const PATHS = {
    HOME: '/',
    LOGIN: '/login',
    COMPUTE_PLANS: '/compute_plans',
    COMPUTE_PLANS_DETAILS: '/compute_plans/:key',
    COMPUTE_PLAN: '/compute_plan',
    COMPUTE_PLAN_DETAILS: '/compute_plan/:key',
    DATASETS: '/datasets',
    DATASET: '/datasets/:key',
    ALGOS: '/algorithms',
    ALGO: '/algorithms/:key',
    METRICS: '/metrics',
    METRIC: '/metrics/:key',
    TASKS: '/tasks',
    TASK: '/tasks/:key',
};

export const ROUTES: { [key: string]: IRoute } = {
    HOME: {
        path: PATHS.HOME,
        component: Home,
    },
    LOGIN: {
        path: PATHS.LOGIN,
        component: Login,
    },
    COMPUTE_PLANS: {
        // the following path matches both PATHS.COMPUTE_PLANS and PATHS.COMPUTE_PLAN
        path: '/compute_plans/:key?',
        component: ComputePlans,
    },
    COMPUTE_PLAN_DETAILS: {
        path: PATHS.COMPUTE_PLAN_DETAILS,
        component: ComputePlanDetails,
    },
    COMPUTE_PLAN: {
        path: PATHS.COMPUTE_PLAN,
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
    METRICS: {
        path: '/metrics/:key?',
        component: Metrics,
    },
    TASKS: {
        path: '/tasks/:key?',
        component: Tasks,
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
