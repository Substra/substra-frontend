import { FC } from 'react';
import ComputePlan from '@/routes/computePlan/ComputePlan';
import Datasets from '@/routes/datasets/Datasets';
import Login from '@/routes/login/Login';

interface IRoute {
    path: string;
    component: FC;
}

export const ROUTES: { [key: string]: IRoute } = {
    LOGIN: {
        path: '/login',
        component: Login,
    },
    COMPUTE_PLAN: {
        path: '/computePlan',
        component: ComputePlan,
    },
    DATASETS: {
        path: '/datasets',
        component: Datasets,
    },
};
