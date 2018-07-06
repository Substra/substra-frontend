import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'react-emotion';


import ServiceWorker from './business/common/components/serviceWorker';
import Top from './business/top';
import Search from './business/search';

import Route from './business/routes';

const Container = styled('div')`
    height: 100%;
`;

const Routes = ({page}) => (
    <Container>
        <ServiceWorker />
        <Top />
        <Search />
        <Route page={page} />
    </Container>);

Routes.propTypes = {
    page: PropTypes.string.isRequired,
};

const mapStateToProps = ({location}, ownProps) => ({page: location.type, ...ownProps});

export default connect(mapStateToProps)(Routes);
