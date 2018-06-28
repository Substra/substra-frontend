import React from 'react';
import {NOT_FOUND} from "redux-first-router";

/* Declare routes */
import ProblemRoutes from './problem/routes';
import DatasetRoutes from './dataset/routes';
import AlgorithmRoutes from './algorithm/routes';
import ModelRoutes from './model/routes';
import DocRoutes from './doc/routes';
import NotFoundRoutes from './notFound/routes';


export default (page) => {
    switch (page) {
        case 'HOME':
        case 'PROBLEM':
            return <ProblemRoutes />;
        case 'DATASET':
            return <DatasetRoutes />;
        case 'ALGORITHM':
            return <AlgorithmRoutes />;
        case 'MODEL':
            return <ModelRoutes />;
        case 'DOC':
            return <DocRoutes />;
        case NOT_FOUND:
        default:
            return <NotFoundRoutes/>;
    }
};
