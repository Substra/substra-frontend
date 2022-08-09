import { FC } from 'react';

import Algos from '@/routes/algos/Algos';
import Compare from '@/routes/compare/Compare';
import ComputePlanChart from '@/routes/computePlanDetails/ComputePlanChart';
import ComputePlanRoot from '@/routes/computePlanDetails/ComputePlanRoot';
import ComputePlanTasks from '@/routes/computePlanDetails/ComputePlanTasks';
import ComputePlanTasksRoot from '@/routes/computePlanDetails/ComputePlanTasksRoot';
import ComputePlanWorkflow from '@/routes/computePlanDetails/ComputePlanWorkflow';
import ComputePlans from '@/routes/computePlans/ComputePlans';
import Dataset from '@/routes/dataset/Dataset';
import Datasets from '@/routes/datasets/Datasets';
import Home from '@/routes/home/Home';
import Login from '@/routes/login/Login';
import Settings from '@/routes/settings/Settings';
import Tasks from '@/routes/tasks/Tasks';
import TasksRoot from '@/routes/tasks/TasksRoot';

import { PATHS } from './paths';

type IRouteT = {
    path: string;
    component: FC;
};

export const ROUTES: Record<string, IRouteT> = {
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
    COMPUTE_PLAN_WORKFLOW: {
        path: PATHS.COMPUTE_PLAN_WORKFLOW,
        component: ComputePlanWorkflow,
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
