import React from 'react';
import universal from 'react-universal-component';
import {connect} from 'react-redux';
import PulseLoader from '../common/routes/pulseLoader';

const Universal = universal(import('./components/index'), {
    loading: <PulseLoader />,
});

const mapStateToProps = ({user}, ownProps) => ({user, ...ownProps});

export default connect(mapStateToProps)((props) => {
    const {user} = props;
    return user && user.authenticated ? null : <Universal />;
});
