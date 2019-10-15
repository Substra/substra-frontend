import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from '@emotion/styled';

import ServiceWorker from './business/common/components/serviceWorker';
import Content from './business/content/routes';
import UserRoute from './business/user/routes';

const Container = styled('div')`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const Routes = ({page, user}) => (
    <Container>
        <ServiceWorker />
        {page === 'USER'
            ? <UserRoute user={user} />
            : <Content />}
    </Container>
);

Routes.propTypes = {
    page: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
};

const mapStateToProps = ({location, user}) => ({page: location.type, user});

export default connect(mapStateToProps)(Routes);
