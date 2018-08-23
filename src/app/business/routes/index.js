import React from 'react';
import {NOT_FOUND} from 'redux-first-router';

/* Declare routes */
import Component from '../common/routes/index';
import NotFoundRoutes from './notFound/routes/index';


const Route = ({page, addFilter}) => {
    switch (page) {
        case 'HOME':
        case 'CHALLENGE':
            return <Component model="challenge" addFilter={addFilter} />;
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
