/* global GOOGLE_ANALYTICS_TRACKER_ID */
import ReactGA from 'react-ga';
import React from 'react';
import {connect} from 'react-redux';

export const ENTITY_TYPE = 'dimension1';
export const ENTITY_KEY = 'dimension2';
export const SEARCHBAR_CHALLENGE_COUNT = 'metric1';
export const SEARCHBAR_MODEL_COUNT = 'metric2';
export const SEARCHBAR_ALGO_COUNT = 'metric3';
export const SEARCHBAR_DATASET_COUNT = 'metric4';

export const LOG_LIST = 'logList';
export const LOG_DETAIL = 'logDetail';
export const LOG_DOC = 'logDoc';
export const LOG_FILTER_FROM_DETAIL = 'logFilterFromDetail';
export const LOG_COPY_FROM_DETAIL = 'logCopyFromDetail';
export const LOG_DOWNLOAD_FROM_DETAIL = 'logDownloadFromDetail';
export const LOG_FILTER_FROM_LIST = 'logFilterFromList';
export const LOG_COPY_FROM_LIST = 'logCopyFromList';
export const LOG_DOWNLOAD_FROM_LIST = 'logDownloadFromList';
export const LOG_REMOVE_FILTER = 'logRemoveFilter';
export const LOG_ADD_FILTER = 'logAddFilter';
export const LOG_CLEAR_FILTERS = 'logClearFilters';

const metricsMap = {
    dataset: SEARCHBAR_DATASET_COUNT,
    model: SEARCHBAR_MODEL_COUNT,
    algo: SEARCHBAR_MODEL_COUNT,
    challenge: SEARCHBAR_CHALLENGE_COUNT,
};

const defaultMetrics = {
    [SEARCHBAR_CHALLENGE_COUNT]: 0,
    [SEARCHBAR_MODEL_COUNT]: 0,
    [SEARCHBAR_ALGO_COUNT]: 0,
    [SEARCHBAR_DATASET_COUNT]: 0,
};

const metricsReducer = (metrics, item) => {
    const metricName = metricsMap[item.parent];
    if (metricName) {
        return {
            ...metrics,
            [metricName]: metrics[metricName] + 1,
        };
    }
    return metrics;
};


const _searchbarMetrics = state => state.search.selectedItem.reduce(metricsReducer, defaultMetrics);

const _defaultEventData = state => ({
    category: 'Entity',
    [ENTITY_TYPE]: state.location.type,
    ..._searchbarMetrics(state),
});


const _createLogFunction = action => state => (eventData) => {
    ReactGA.event({
        ..._defaultEventData(state),
        action,
        ...eventData,
    });
};

const _createLogFunctionWithEntityKey = action => state => (entityKey) => {
    ReactGA.event({
        ..._defaultEventData(state),
        action,
        [ENTITY_KEY]: entityKey,
    });
};

const _createLogFunctionWithEntityType = action => state => (entityType) => {
    ReactGA.event({
        ..._defaultEventData(state),
        action,
        [ENTITY_TYPE]: entityType,
    });
};

const logFunctions = {
    [LOG_LIST]: _createLogFunction('List'),
    [LOG_DETAIL]: _createLogFunctionWithEntityKey('Detail'),
    [LOG_FILTER_FROM_DETAIL]: _createLogFunctionWithEntityKey('Filter from detail'),
    [LOG_COPY_FROM_DETAIL]: _createLogFunctionWithEntityKey('Copy from detail'),
    [LOG_DOWNLOAD_FROM_DETAIL]: _createLogFunctionWithEntityKey('Download from detail'),
    [LOG_FILTER_FROM_LIST]: _createLogFunctionWithEntityKey('Filter from list'),
    [LOG_COPY_FROM_LIST]: _createLogFunctionWithEntityKey('Copy from list'),
    [LOG_DOWNLOAD_FROM_LIST]: _createLogFunctionWithEntityKey('Download from list'),
    [LOG_REMOVE_FILTER]: _createLogFunctionWithEntityType('Remove filter'),
    [LOG_ADD_FILTER]: _createLogFunctionWithEntityType('Add filter'),
    [LOG_CLEAR_FILTERS]: _createLogFunction('Clear filters'),
    [LOG_DOC]: _createLogFunction('Doc'),
};


const withAnalytics = (WrappedComponent, funcNames) => {
    const WithAnalyticsWrapper = ({state, ...props}) => {
        const componentLogFuncs = Object.keys(logFunctions)
            .reduce((funcs, funcName) => ({
                ...funcs,
                ...(funcNames.includes(funcName) ? {[funcName]: logFunctions[funcName](state)} : {}),
            }), {});
        return <WrappedComponent {...props} {...componentLogFuncs} />;
    };

    const mapStateToProps = (state, ownProps) => ({
        state,
        ...ownProps,
    });

    return connect(mapStateToProps)(WithAnalyticsWrapper);
};

export default withAnalytics;

export const initializeAnalytics = () => {
    ReactGA.initialize(GOOGLE_ANALYTICS_TRACKER_ID, {
        debug: process.env.NODE_ENV === 'development',
    });
};
