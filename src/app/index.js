import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import ServiceWorker from './business/common/components/serviceWorker';
import Top from './business/top/redux';
import Nav from './business/nav/redux';

import Route from './business/routes';
import Search from './business/search/routes';

const Container = styled('div')`
    height: 100%;
    display: flex;
    flex-direction: column;
`;


const Routes = ({page}) => (
    <Container>
        <ServiceWorker />
        <Top />
        <Search />
        <Nav />
        <Route page={page} />
    </Container>
);

Routes.propTypes = {
    page: PropTypes.string.isRequired,
};

const mapStateToProps = ({location}) => ({page: location.type});

export default connect(mapStateToProps)(Routes);
