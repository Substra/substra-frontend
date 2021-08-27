import { FC } from 'react';

import Algos from '@/routes/algos/Algos';
import ComputePlan from '@/routes/computePlan/ComputePlan';
import ComputePlanChart from '@/routes/computePlanDetails/ComputePlanChart';
import ComputePlanDetails from '@/routes/computePlanDetails/ComputePlanDetails';
import ComputePlanTasks from '@/routes/computePlanDetails/ComputePlanTasks';
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
    COMPUTE_PLANS: {
        // the following path matches both PATHS.COMPUTE_PLANS and PATHS.COMPUTE_PLANS_DETAILS
        path: '/compute_plans/:key?',
        component: ComputePlans,
    },
    COMPUTE_PLAN_DETAILS: {
        path: PATHS.COMPUTE_PLAN_DETAILS,
        component: ComputePlanDetails,
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
