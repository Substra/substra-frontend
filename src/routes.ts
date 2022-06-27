import { FC } from 'react';

import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import Algos from '@/routes/algos/Algos';
import Compare from '@/routes/compare/Compare';
import ComputePlanChart from '@/routes/computePlanDetails/ComputePlanChart';
import ComputePlanRoot from '@/routes/computePlanDetails/ComputePlanRoot';
import ComputePlanTasks from '@/routes/computePlanDetails/ComputePlanTasks';
import ComputePlanTasksRoot from '@/routes/computePlanDetails/ComputePlanTasksRoot';
import ComputePlans from '@/routes/computePlans/ComputePlans';
import Dataset from '@/routes/dataset/Dataset';
import Datasets from '@/routes/datasets/Datasets';
import Home from '@/routes/home/Home';
import Login from '@/routes/login/Login';
import Settings from '@/routes/settings/Settings';
import Tasks from '@/routes/tasks/Tasks';
import TasksRoot from '@/routes/tasks/TasksRoot';

interface IRoute {
    path: string;
    component: FC;
}

export const PATHS = {
    HOME: '/',
    LOGIN: '/login',
    COMPARE: '/compare/:keys',
    COMPUTE_PLANS: '/compute_plans',
    COMPUTE_PLAN: '/compute_plans/:key',
    COMPUTE_PLAN_CHART: '/compute_plans/:key/chart',
    COMPUTE_PLAN_TASKS_ROOT: '/compute_plans/:key/tasks',
    COMPUTE_PLAN_TASKS: '/compute_plans/:key/tasks/:category',
    COMPUTE_PLAN_TASK: '/compute_plans/:key/tasks/:category/:taskKey',
    DATASETS: '/datasets',
    DATASET: '/datasets/:key',
    ALGOS: '/algorithms',
    ALGO: '/algorithms/:key',
    SETTINGS: '/settings',
    TASKS_ROOT: '/tasks',
    TASKS: '/tasks/:category',
    TASK: '/tasks/:category/:key',
};

export const TASK_CATEGORY_SLUGS: Record<TaskCategory, string> = {
    [TaskCategory.test]: 'test',
    [TaskCategory.train]: 'train',
    [TaskCategory.composite]: 'composite_train',
    [TaskCategory.aggregate]: 'aggregate',
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
    COMPUTE_PLAN: {
        path: PATHS.COMPUTE_PLAN,
        component: ComputePlanRoot,
    },
    COMPUTE_PLAN_CHART: {
        path: PATHS.COMPUTE_PLAN_CHART,
        component: ComputePlanChart,
    },
    COMPUTE_PLAN_TASKS_ROOT: {
        path: PATHS.COMPUTE_PLAN_TASKS_ROOT,
        component: ComputePlanTasksRoot,
    },
    COMPUTE_PLAN_TASKS: {
        // the following path matches both PATHS.COMPUTE_PLAN_TASKS and PATHS.COMPUTE_PLAN_TASK
        path: '/compute_plans/:key/tasks/:category/:taskKey?',
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
    SETTINGS: {
        path: PATHS.SETTINGS,
        component: Settings,
    },
    TASKS_ROOT: {
        path: PATHS.TASKS_ROOT,
        component: TasksRoot,
    },
    TASKS: {
        path: '/tasks/:category/:key?',
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
