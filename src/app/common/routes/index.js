import React, {Component} from 'react';
import PropTypes from 'prop-types';
import universal from 'react-universal-component';
import {injectSaga, injectReducer} from 'redux-sagas-injector';
import {ReactReduxContext} from 'react-redux';

import PulseLoader from './pulseLoader';

class UniversalRoute extends Component {
    constructor(props) {
        super(props);
        this.firstRender = true;
    }

    render() {
        const {model} = this.props;

        // need to pass different path for generating different chunks
        // https://github.com/faceyspacey/babel-plugin-universal-import#caveat
        const U = universal(import(`../../routes/${model}/preload/index`), {
            loading: <PulseLoader />,
            ignoreBabelRename: true,
            chunkName: () => `routes/${model}-preload-index`,
            onLoad: (module, info, {reduxcontext}) => {
                if (reduxcontext && reduxcontext.store) {
                    injectSaga(model, module.sagas, false, reduxcontext.store);
                    injectReducer(model, module.reducer, false, reduxcontext.store);
                }
            },
        });

        if (this.firstRender) {
            this.firstRender = false;
            return (
                <ReactReduxContext.Consumer>
                    {(reduxContext) => <U model={model} reduxcontext={reduxContext} />}
                </ReactReduxContext.Consumer>
            );
        }

        return <U model={model} />;
    }
}


UniversalRoute.defaultProps = {
    model: '',
};

UniversalRoute.propTypes = {
    model: PropTypes.string,
};

export default UniversalRoute;
