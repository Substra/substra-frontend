import React, {Component} from 'react';
import {injectSaga, injectReducer} from 'redux-sagas-injector';
import Search, {
    objectiveSagas, objectiveReducer,
    datasetSagas, datasetReducer,
    algoSagas, algoReducer,
    modelSagas, modelReducer,
    routeSagas,
} from '../components';

class C extends Component {
    constructor(props) {
        super(props);
        injectSaga('objective', objectiveSagas);
        injectReducer('objective', objectiveReducer);

        injectSaga('dataset', datasetSagas);
        injectReducer('dataset', datasetReducer);

        injectSaga('algo', algoSagas);
        injectReducer('algo', algoReducer);

        injectSaga('model', modelSagas);
        injectReducer('model', modelReducer);

        injectSaga('route', routeSagas);
    }

    render() {
        return <Search />;
    }
}

export default C;
