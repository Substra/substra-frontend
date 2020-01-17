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

const Routes = ({page}) => (
    <Container>
        <ServiceWorker />
        {page === 'LOGIN'
            ? <UserRoute />
            : <Content />}
    </Container>
);

Routes.propTypes = {
    page: PropTypes.string.isRequired,
};

const mapStateToProps = ({location}) => ({page: location.type});

export default connect(mapStateToProps)(Routes);
