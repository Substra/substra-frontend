import { FC } from 'react';

import Compare from '@/routes/compare/Compare';
import ComputePlanRoot from '@/routes/computePlanDetails/ComputePlanRoot';
import ComputePlanChart from '@/routes/computePlanDetails/chart/ComputePlanChart';
import ComputePlanTasks from '@/routes/computePlanDetails/tasks/ComputePlanTasks';
import ComputePlanWorkflow from '@/routes/computePlanDetails/workflow/ComputePlanWorkflow';
import ComputePlans from '@/routes/computePlans/ComputePlans';
import Dataset from '@/routes/dataset/Dataset';
import Datasets from '@/routes/datasets/Datasets';
import Functions from '@/routes/functions/Functions';
import Home from '@/routes/home/Home';
import Login from '@/routes/login/Login';
import ResetPassword from '@/routes/resetPassword/ResetPassword';
import Settings from '@/routes/settings/Settings';
import Tasks from '@/routes/tasks/Tasks';
import Users from '@/routes/users/Users';

import { PATHS } from './paths';
import ApiTokens from './routes/tokens/ApiTokens';

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
    COMPUTE_PLAN_TASKS: {
        // the following path matches both PATHS.COMPUTE_PLAN_TASKS and PATHS.COMPUTE_PLAN_TASK
        path: '/compute_plans/:key/tasks/:taskKey?',
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
    FUNCTIONS: {
        path: '/functions/:key?',
        component: Functions,
    },
    SETTINGS: {
        path: PATHS.SETTINGS,
        component: Settings,
    },
    TASKS: {
        path: '/tasks/:key?',
        component: Tasks,
    },
    USERS: {
        path: '/users/:key?',
        component: Users,
    },
    RESET_PASSWORD: {
        path: PATHS.RESET_PASSWORD,
        component: ResetPassword,
    },
    MANAGE_TOKENS: {
        path: PATHS.MANAGE_TOKENS,
        component: ApiTokens,
    },
};
