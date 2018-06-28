/* global APP_NAME */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const HelmetTitle = ({title}) => <Helmet title={APP_NAME + (title ? ` - ${title}` : '')} />;

HelmetTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export default HelmetTitle;
