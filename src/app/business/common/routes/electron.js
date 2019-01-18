import React, {Component} from 'react';
import {injectSaga, injectReducer} from 'redux-sagas-injector';
import PulseLoader from './pulseLoader';

// import classic, no need to lazy load on desktop
class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.model !== prevState.model) {
            const {model} = nextProps;

            const Module = require(`../../routes/${model}/preload/index`).default,
                sagas = require(`../../routes/${model}/sagas/index`).default,
                reducer = require(`../../routes/${model}/reducers/index`).default;

            injectSaga(model, sagas);
            injectReducer(model, reducer);

            return {Component: Module};
        }
    }

    render() {
        const {Component} = this.state;
        return !Component ? <Component /> : <PulseLoader />;
    }
}

export default Route;
