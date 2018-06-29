import React from 'react';
import universal from 'react-universal-component';
import {injectReducer} from 'redux-reducers-injector';
import {injectSaga} from 'redux-sagas-injector';

import PulseLoader from '../components/presentation/loaders/PulseLoader';
import {coolBlue} from '../../../../../assets/css/variables/index';

// need to pass different path for generating different chunks
//https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = ({model}) => {
    const U = universal(import(`../../routes/${model}/preload/index`), {
        loading: <PulseLoader size={6} color={coolBlue} />,
        onLoad: module => {
            injectSaga(model, module.sagas);
            injectReducer(model, module.reducer);
        },
    });

    return <U model={model}/>
};

export default Universal;
