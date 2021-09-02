import styled from '@emotion/styled';
import { useRoute } from 'wouter';

import { PATHS } from '@/routes';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    border: 1px solid ${Colors.border};
    border-radius: 8px;
    background: white;
    margin: 0 auto;
    align-self: center;
    padding: ${Spaces.extraLarge} ${Spaces.xxl};
    width: 500px;
`;

const H1 = styled.h1`
    font-weight: bold;
    font-size: ${Fonts.sizes.h1};
    border-bottom: 1px solid ${Colors.border};
    margin-bottom: ${Spaces.extraLarge};
    padding-bottom: ${Spaces.small};
`;

const Ul = styled.ul`
    margin-top: ${Spaces.medium};
    list-style: disc;
    list-style-position: inside;
`;

const Compare = (): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPARE);
    const keys = decodeURIComponent(params?.keys || '').split(',');

    return (
        <Container>
            <H1>Coming soon</H1>
            Comparison of the following compute plans:
            <Ul>
                {keys.map((key) => (
                    <li key={key}>{key}</li>
                ))}
            </Ul>
        </Container>
    );
};
export default Compare;
