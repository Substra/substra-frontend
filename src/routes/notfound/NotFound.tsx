import styled from '@emotion/styled';

import { useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

import StyledLink from '@/components/StyledLink';
import { H1 } from '@/components/Typography';

import OwkinConnectLogo from '@/assets/svg/owkin-connect-logo';
import { Spaces } from '@/assets/theme';

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

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Page not found'),
        []
    );

    return (
        <Container>
            <OwkinConnectLogo />
            <H1>Page not found</H1>
            {authenticated ? (
                <StyledLink href={PATHS.DATASETS}>
                    Go to datasets page
                </StyledLink>
            ) : (
                <StyledLink href={PATHS.LOGIN}>Go to login page</StyledLink>
            )}
        </Container>
    );
};

export default NotFound;
