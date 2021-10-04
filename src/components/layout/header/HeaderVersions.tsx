import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { useAppSelector } from '@/hooks';

const Title = styled.p`
    font-size: var(--chakra-fontSizes-sm);
    line-height: var(--chakra-lineHeights-5);
    font-weight: var(--chakra-fontWeights-medium);
    color: var(--chakra-colors-gray-500);
    margin: var(--chakra-space-1\\.5) var(--chakra-space-2\\.5);
`;

const Dl = styled.dl`
    display: grid;
    grid-template-columns: 1fr 90px;
    margin: 0 var(--chakra-space-2\\.5);
`;

const cell = css`
    font-size: var(--chakra-fontSizes-xs);
    line-height: var(--chakra-lineHeights-4);
    font-weight: var(--chakra-fontWeights-normal);
    color: var(--chakra-colors-gray-500);
`;

const Dt = styled.dt`
    ${cell}
`;

const Dd = styled.dd`
    ${cell}
    text-align: right;
`;

declare const __APP_VERSION__: string;

const HeaderVersions = (): JSX.Element => {
    const backendVersion = useAppSelector((state) => state.nodes.info.version);
    const orchestratorVersion = useAppSelector(
        (state) => state.nodes.info.orchestrator_version
    );
    const chaincodeVersion = useAppSelector(
        (state) => state.nodes.info.chaincode_version
    );

    return (
        <>
            <Title>Versions</Title>
            <Dl>
                <Dt>Frontend</Dt>
                <Dd>{__APP_VERSION__}</Dd>
                <Dt>Backend</Dt>
                <Dd>{backendVersion}</Dd>
                <Dt>Orchestrator</Dt>
                <Dd>{orchestratorVersion}</Dd>
                {chaincodeVersion && (
                    <>
                        <Dt>Chaincode</Dt>
                        <Dd>{chaincodeVersion}</Dd>
                    </>
                )}
            </Dl>
        </>
    );
};
export default HeaderVersions;
