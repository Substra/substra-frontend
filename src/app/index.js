import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import ServiceWorker from './business/common/components/serviceWorker';
import Top from './business/top/redux';
import Nav from './business/nav/redux';

import Route from './business/routes';
import Search from './business/search/routes';
import UserRoute from './business/user/routes';

const Container = styled('div')`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const Routes = ({page, user}) => (
    <Container>
        <ServiceWorker />
        {user && user.authenticated ? (
            <Fragment>
                <Top />
                <Search />
                <Nav />
                <Route page={page} />
            </Fragment>
            )
            : <UserRoute />
        }
    </Container>
);

Routes.propTypes = {
    page: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
};

const mapStateToProps = ({location, user}) => ({page: location.type, user});

export default connect(mapStateToProps)(Routes);
