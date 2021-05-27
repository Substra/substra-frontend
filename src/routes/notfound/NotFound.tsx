import React from 'react';
import styled from '@emotion/styled';
import OwkinConnectLogo from '@/assets/svg/owkin-connect-logo';
import { H1 } from '@/components/utils/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ROUTES } from '@/routes';
import { Spaces } from '@/assets/theme';
import { Link } from 'wouter';

const Container = styled.div`
    // center in the viewport and not just in the container
    margin-left: auto;
    margin-right: auto;
    align-self: center;
    margin-top: -72px;

    text-align: center;

    svg {
        width: 500px;
        margin-bottom: ${Spaces.extraLarge};
    }

    h1 {
        margin-bottom: ${Spaces.extraLarge};
    }
`;

const NotFound = (): JSX.Element => {
    const authenticated = useSelector(
        (state: RootState) => state.user.authenticated
    );

    return (
        <Container>
            <OwkinConnectLogo />
            <H1>Page not found</H1>
            {authenticated ? (
                <Link href={ROUTES.DATASETS.path}>Go to datasets page</Link>
            ) : (
                <Link href={ROUTES.LOGIN.path}>Go to login page</Link>
            )}
        </Container>
    );
};

export default NotFound;
