import React, {Component} from 'react';
import universal from 'react-universal-component';
import {injectSagaBulk, injectReducerBulk} from 'redux-sagas-injector';
import {ReactReduxContext} from 'react-redux';

import PulseLoader from 'react-spinners/PulseLoader';

class UniversalContent extends Component {
    constructor(props) {
        super(props);
        this.firstRender = true;
    }

    render() {
        const U = universal(import('./components/index'), {
            loading: <PulseLoader size={6} />,
            onLoad: (module, info, {reduxcontext, ...props}) => {
                // need all models reducers
                // do not forget to pass the reduxcontext.store AND the withInjectedReducers wrapper to your imported redux component, or concurrent calls in the server part will fail

                if (reduxcontext && reduxcontext.store) {
                    const sagas = [
                        {key: 'objective', saga: module.objectiveSagas},
                        {key: 'dataset', saga: module.datasetSagas},
                        {key: 'algo', saga: module.algoSagas},
                        {key: 'model', saga: module.modelSagas},
                    ];
                    const reducers = [
                        {key: 'objective', reducer: module.objectiveReducer},
                        {key: 'dataset', reducer: module.datasetReducer},
                        {key: 'algo', reducer: module.algoReducer},
                        {key: 'model', reducer: module.modelReducer},
                    ];

                    injectSagaBulk(sagas, false, reduxcontext.store);
                    injectReducerBulk(reducers, false, reduxcontext.store);
                }
            },
            ignoreBabelRename: true,
        });
        if (this.firstRender) {
            this.firstRender = false;
            return (
                <ReactReduxContext.Consumer>
                    {(reduxContext) => <U reduxcontext={reduxContext} />}
                </ReactReduxContext.Consumer>
            );
        }

        return <U />;
    }
}

export default UniversalContent;
