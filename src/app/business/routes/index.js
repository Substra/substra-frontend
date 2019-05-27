import React from 'react';
import PropTypes from 'prop-types';
import {NOT_FOUND} from 'redux-first-router';

/* Declare routes */
import Component from '../common/routes';
import NotFoundRoutes from './notFound/routes';


const Route = ({page}) => {
    switch (page) {
        case 'HOME':
        case 'OBJECTIVE':
            return <Component model="objective" />;
        case 'DATASET':
            return <Component model="dataset" />;
        case 'ALGORITHM':
            return <Component model="algo" />;
        case 'MODEL':
            return <Component model="model" />;
        case NOT_FOUND:
        default:
            return <NotFoundRoutes />;
    }
};

Route.propTypes = {
    page: PropTypes.string,
};

Route.defaultProps = {
    page: '',
};

export default Route;
