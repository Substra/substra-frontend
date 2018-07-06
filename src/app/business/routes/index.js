import React from 'react';
import {NOT_FOUND} from 'redux-first-router';

/* Declare routes */
import Component from '../common/routes';
import NotFoundRoutes from './notFound/routes';


const Route = ({page}) => {
    switch (page) {
        case 'HOME':
        case 'PROBLEM':
            return <Component model="problem" />;
        case 'DATASET':
            return <Component model="dataset" />;
        case 'ALGORITHM':
            return <Component model="algorithm" />;
        case 'MODEL':
            return <Component model="model" />;
        case 'DOC':
            return <Component model="doc" />;
        case NOT_FOUND:
        default:
            return <NotFoundRoutes />;
    }
};

export default Route;
