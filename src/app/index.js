import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import {replace} from 'redux-first-router';

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

const Content = ({user, children}) => {
    if (user && !user.authenticated) {
        replace('/user');
        return null;
    }

    return children;
};

const Routes = ({page, user}) => (
    <Container>
        <ServiceWorker />
        {page === 'USER' ? <UserRoute user={user} />
            : (
                <Content user={user}>
                    <Top />
                    <Search />
                    <Nav />
                    <Route page={page} />
                </Content>
        )}
    </Container>
);

Routes.propTypes = {
    page: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
};

const mapStateToProps = ({location, user}) => ({page: location.type, user});

export default connect(mapStateToProps)(Routes);
