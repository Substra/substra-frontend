import React, {Component} from 'react';
import {injectSaga, injectReducer} from 'redux-sagas-injector';
import Search, {
    challengeSagas, challengeReducer,
    datasetSagas, datasetReducer,
    algoSagas, algoReducer,
    modelSagas, modelReducer,
} from '../components';

class C extends Component {
    constructor(props) {
        super(props);
        injectSaga('challenge', challengeSagas);
        injectReducer('challenge', challengeReducer);

        injectSaga('dataset', datasetSagas);
        injectReducer('dataset', datasetReducer);

        injectSaga('algo', algoSagas);
        injectReducer('algo', algoReducer);

        injectSaga('model', modelSagas);
        injectReducer('model', modelReducer);
    }

    render() {
        return <Search />;
    }
}

export default C;
