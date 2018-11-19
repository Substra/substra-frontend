import React from 'react';
import universal from 'react-universal-component';
import {injectReducer} from 'redux-reducers-injector';
import {injectSaga} from 'redux-sagas-injector';

import {PulseLoader} from 'react-spinners';
import {coolBlue} from '../../../../../assets/css/variables/index';


const UniversalSearch = universal(import('../../search/components/index'), {
    loading: <PulseLoader size={6} color={coolBlue} />,
    onLoad: (module, info, props, context) => {
        // need all models reducers
        // do not forget to pass the context.store, or simultaneous calls in the server part will fail

        injectSaga('challenge', module.challengeSagas, false, context.store);
        injectReducer('challenge', module.challengeReducer, false, context.store);

        injectSaga('dataset', module.datasetSagas, false, context.store);
        injectReducer('dataset', module.datasetReducer, false, context.store);

        injectSaga('algo', module.algoSagas, false, context.store);
        injectReducer('algo', module.algoReducer, false, context.store);

        injectSaga('model', module.modelSagas, false, context.store);
        injectReducer('model', module.modelReducer, false, context.store);
    },
    ignoreBabelRename: true,
});

export default UniversalSearch;
