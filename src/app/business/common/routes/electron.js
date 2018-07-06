import React, {Component} from 'react';
import {injectReducer} from 'redux-reducers-injector';
import {injectSaga} from 'redux-sagas-injector';
import {PulseLoader} from 'react-spinners';

import {coolBlue} from '../../../../../assets/css/variables/index';

// import classic, no need to lazy load on desktop
class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.model !== prevState.model) {
            const {model} = nextProps;

            const Module = require(`../../routes/${model}/components/index`).default,
                sagas = require(`../../routes/${model}/sagas`).default,
                reducer = require(`../../routes/${model}/reducers`).default;

            injectSaga(model, sagas);
            injectReducer(model, reducer);

            return {Component: Module};
        }
    }

    render() {
        const {Component} = this.state;
        return Component ? <Component /> : <PulseLoader size={6} color={coolBlue} />;
    }
}

export default Route;
