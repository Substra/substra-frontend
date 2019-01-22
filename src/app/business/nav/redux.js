import {connect} from 'react-redux';

import {getRoutes, getOrders} from './selector';
import Nav from './components';
import withInjectedReducers from '../common/components/withInjectedReducers';

const mapStateToProps = state => ({
        routes: getRoutes(state),
        location: state.location,
        orders: getOrders(state),
    });

export default withInjectedReducers(connect(mapStateToProps)(Nav));
