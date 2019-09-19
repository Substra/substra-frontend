import React from 'react';
import PropTypes from 'prop-types';
import universal from 'react-universal-component';

import PulseLoader from '../common/routes/pulseLoader';

// need to pass different path for generating different chunks
// https://github.com/faceyspacey/babel-plugin-universal-import#caveat
const Universal = universal(import('../user/components/index'), {
    loading: <PulseLoader />,
    ignoreBabelRename: true,
});

const User = ({user}) => user && user.authenticated ? null : <Universal />;

User.propTypes = {
    user: PropTypes.shape().isRequired,
};

export default User;
