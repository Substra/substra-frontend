import { FC } from 'react';
import Channel from '@/routes/channel/Channel';
import ComputePlan from '@/routes/computePlan/ComputePlan';
import Dataset from '@/routes/dataset/Dataset';
import Explorer from '@/routes/explorer/Explorer';
import Login from '@/routes/login/LoginContainer';

interface IRoute {
    path: string;
    component: FC;
}

export const ROUTES: { [key: string]: IRoute } = {
    LOGIN: {
        path: '/login',
        component: Login,
    },
    CHANNEL: {
        path: '/channel',
        component: Channel,
    },
    COMPUTE_PLAN: {
        path: '/computePlan',
        component: ComputePlan,
    },
    DATASET: {
        path: '/dataset',
        component: Dataset,
    },
    EXPLORER: {
        path: '/explorer',
        component: Explorer,
    },
};
