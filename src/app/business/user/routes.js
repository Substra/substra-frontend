/* globals window */

import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import universal from 'react-universal-component';
import {onlyUpdateForKeys} from 'recompose';

import PulseLoader from '../common/routes/pulseLoader';
import {refresh} from './actions';

// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const UniversalUser = universal(import('../user/components/index'), {
    loading: <PulseLoader />,
    ignoreBabelRename: true,
});

const User = ({
                  authenticated, refreshLoading, init, refresh,
              }) => {
    if (typeof window !== 'undefined') {
        if (!init && !authenticated && !refreshLoading) { // try refresh on init
            refresh();
        }
    }

    return refreshLoading || !init ? <PulseLoader /> : (authenticated ? null : <UniversalUser />);
};

User.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    refreshLoading: PropTypes.bool.isRequired,
    init: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    refreshLoading: state.user.refreshLoading,
    init: state.user.init,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    refresh: refresh.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['authenticated', 'refreshLoading', 'init'])(User));
