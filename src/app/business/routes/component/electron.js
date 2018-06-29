import React, {Component} from 'react';


import {injectReducer} from "redux-reducers-injector";
import {injectSaga} from "redux-sagas-injector";


//import classic, no need to lazy load ond esktop
class Comp extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        const {model} = this.props;

        const promises = [
            import(`../${model}/components/index`),
            import(`../${model}/sagas`),
            import(`../${model}/reducers`)
        ];

        Promise.all(promises).then((module) => {

            const sagas = module[1].default,
                reducer = module[2].default;

            injectSaga(model, sagas);
            injectReducer(model, reducer);

            this.setState({
                Component: module[0].default
            })
        });
    }

    render() {
        const {Component} = this.state;
        return Component ? <Component/> : null;
    }
}

export default Comp;
