import {connect} from 'react-redux';

import {getRoutes} from './selector';
import Nav from './index';

const mapStateToProps = state => ({
    routes: getRoutes(state),
    location: state.location,
});

export default connect(mapStateToProps)(Nav);
