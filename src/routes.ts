import { FC } from 'react';

import Algos from '@/routes/algos/Algos';
import Compare from '@/routes/compare/Compare';
import ComputePlanChart from '@/routes/computePlanDetails/ComputePlanChart';
import ComputePlanTasks from '@/routes/computePlanDetails/ComputePlanTasks';
import ComputePlans from '@/routes/computePlans/ComputePlans';
import Dataset from '@/routes/dataset/Dataset';
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
    COMPARE: '/compare/:keys',
    COMPUTE_PLANS: '/compute_plans',
    COMPUTE_PLAN_CHART: '/compute_plan/:key/chart',
    COMPUTE_PLAN_TASKS: '/compute_plan/:key/tasks',
    COMPUTE_PLAN_TASK: '/compute_plan/:key/tasks/:taskKey',
    DATASETS: '/datasets',
    DATASET: '/datasets/:key',
    ALGOS: '/algorithms',
    ALGO: '/algorithms/:key',
    METRICS: '/metrics',
    METRIC: '/metrics/:key',
    TASKS: '/tasks',
    TASK: '/tasks/:key',
};

export const ROUTES: Record<string, IRoute> = {
    HOME: {
        path: PATHS.HOME,
        component: Home,
    },
    LOGIN: {
        path: PATHS.LOGIN,
        component: Login,
    },
    COMPARE: {
        path: PATHS.COMPARE,
        component: Compare,
    },
    COMPUTE_PLANS: {
        path: PATHS.COMPUTE_PLANS,
        component: ComputePlans,
    },
    COMPUTE_PLAN_CHART: {
        path: PATHS.COMPUTE_PLAN_CHART,
        component: ComputePlanChart,
    },
    COMPUTE_PLAN_TASKS: {
        // the following path matches both PATHS.COMPUTE_PLAN_TASKS and PATHS.COMPUTE_PLAN_TASK
        path: '/compute_plan/:key/tasks/:taskKey?',
        component: ComputePlanTasks,
    },
    DATASET: {
        path: PATHS.DATASET,
        component: Dataset,
    },
    DATASETS: {
        path: PATHS.DATASETS,
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
