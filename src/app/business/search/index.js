import React from 'react';
import universal from 'react-universal-component';
import {injectReducer} from 'redux-reducers-injector';
import {injectSaga} from 'redux-sagas-injector';

import {PulseLoader} from 'react-spinners';
import {coolBlue} from '../../../../assets/css/variables/index';


const UniversalSearch = universal(import('../search/components/index'), {
    loading: <PulseLoader size={6} color={coolBlue} />,
    onLoad: (module) => {
        // need all models reducers

        injectSaga('challenge', module.challengeSagas);
        injectReducer('challenge', module.challengeReducer);

        injectSaga('dataset', module.datasetSagas);
        injectReducer('dataset', module.datasetReducer);

        injectSaga('algo', module.algoSagas);
        injectReducer('algo', module.algoReducer);

        injectSaga('model', module.modelSagas);
        injectReducer('model', module.modelReducer);
    },
});

export default UniversalSearch;
