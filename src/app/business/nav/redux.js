import {connect} from 'react-redux';

import {getRoutes, getOrders} from './selector';
import Nav from './components';
import withInjectedReducers from '../common/components/withInjectedReducers';

const mapStateToProps = state => ({
        routes: getRoutes(state),
        location: state.location,
        orders: getOrders(state),
    });

// injected reducer have been loaded from search component, no need to inject them a second time
// however, we need to make this component aware about he injected reducers
export default withInjectedReducers(connect(mapStateToProps)(Nav));
