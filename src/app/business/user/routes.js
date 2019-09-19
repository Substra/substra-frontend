import React from 'react';
import universal from 'react-universal-component';
import {connect} from 'react-redux';
import PulseLoader from '../common/routes/pulseLoader';

// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = universal(import('../user/components/index'), {
    loading: <PulseLoader />,
    ignoreBabelRename: true,
});

const mapStateToProps = ({user}, ownProps) => ({user, ...ownProps});

export default connect(mapStateToProps)((props) => {
    const {user} = props;
    return user && user.authenticated ? null : <Universal />;
});
