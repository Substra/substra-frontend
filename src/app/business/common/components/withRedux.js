import React, {Component} from 'react';
import {ReactReduxContext} from 'react-redux';

export default function withRedux(WrappedComponent) {
    class WithRedux extends Component {
        constructor(...args) {
            super(...args);
            this.firstRender = true;
        }

        render() {
            if (this.firstRender) {
                this.firstRender = false;
                return (
                    <ReactReduxContext.Consumer>
                        {reduxContext => (
                            <ReactReduxContext.Provider
                                value={{
                                    ...reduxContext,
                                    storeState: reduxContext.store.getState(),
                                }}
                            >
                                <WrappedComponent {...this.props} />
                            </ReactReduxContext.Provider>
                        )}
                    </ReactReduxContext.Consumer>
                );
            }
            return <WrappedComponent {...this.props} />;
        }
    }

    return WithRedux;
}
