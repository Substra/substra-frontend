import React from 'react';
import styled from '@emotion/styled';
import OwkinConnectLogo from '@/assets/svg/owkin-connect-logo';
import { H1 } from '@/components/Typography';
import { useAppSelector } from '@/hooks';
import { PATHS } from '@/routes';
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
    const authenticated = useAppSelector((state) => state.user.authenticated);

    return (
        <Container>
            <OwkinConnectLogo />
            <H1>Page not found</H1>
            {authenticated ? (
                <Link href={PATHS.DATASETS}>Go to datasets page</Link>
            ) : (
                <Link href={PATHS.LOGIN}>Go to login page</Link>
            )}
        </Container>
    );
};

export default NotFound;
