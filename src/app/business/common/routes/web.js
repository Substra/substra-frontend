import React from 'react';
import PropTypes from 'prop-types';
import universal from 'react-universal-component';
import {injectSaga, injectReducer} from 'redux-sagas-injector';
import {ReactReduxContext} from 'react-redux';

import {PulseLoader} from 'react-spinners';

import {coolBlue} from '../../../../../assets/css/variables/index';

// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = ({model}) => {
    const U = universal(import(`../../routes/${model}/preload/index`), {
        loading: <PulseLoader size={6} color={coolBlue}/>,
        onLoad: (module, info, {reduxcontext}) => {
            injectSaga(model, module.sagas, false, reduxcontext.store);
            injectReducer(model, module.reducer, false, reduxcontext.store);
        },
        ignoreBabelRename: true,
    });

    return (<ReactReduxContext.Consumer>
        {(reduxContext) => <U model={model} reduxcontext={reduxContext}/>}
    </ReactReduxContext.Consumer>);
};

Universal.defaultProps = {
    model: '',
};

Universal.propTypes = {
    model: PropTypes.string,
};

export default Universal;
