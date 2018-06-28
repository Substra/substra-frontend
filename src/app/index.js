import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'react-emotion';

import ServiceWorker from './business/common/components/serviceWorker';
import Top from './business/top';
import Search from './business/search';

import getRoute from './business/routes';

const Container = styled('div')`
    height: 100%;
`;

const Routes = ({location}) => (
    <Container>
        <ServiceWorker />
        <Top/>
        <Search/>
        {getRoute(location.type)}
    </Container>);

Routes.propTypes = {
    location: PropTypes.shape({}).isRequired,
};

const mapStateToProps = ({location}, ownProps) => ({location, ...ownProps});

export default connect(mapStateToProps)(Routes);
