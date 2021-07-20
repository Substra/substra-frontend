/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';

import { Colors, Spaces } from '@/assets/theme';

const FakeOpenerContainer = styled.div`
    background-color: ${Colors.background} !important;
    margin-left: -${Spaces.large};
    margin-right: -${Spaces.large};
    padding: ${Spaces.small} ${Spaces.large};
`;

const bottomGap = css`
    margin-bottom: ${Spaces.extraSmall};
`;
export const LoadingOpenerSiderSection = (): JSX.Element => (
    <SiderSection>
        <SiderSectionTitle>Opener</SiderSectionTitle>
        <FakeOpenerContainer>
            <Skeleton width={30} height={10} css={bottomGap} />
            <Skeleton width={70} height={10} css={bottomGap} />
            <Skeleton width={50} height={10} />
        </FakeOpenerContainer>
    </SiderSection>
);

const syntaxHighlighterStyles = css`
    background-color: ${Colors.background} !important;
    margin: -${Spaces.large};

    & * {
        font-family: monospace;
    }
`;

interface OpenerSiderSectionProps {
    opener: string;
}

const OpenerSiderSection = ({
    opener,
}: OpenerSiderSectionProps): JSX.Element => (
    <ExpandableSiderSection title="Opener">
        <SyntaxHighlighter
            language="python"
            style={githubGist}
            css={syntaxHighlighterStyles}
            showLineNumbers={true}
        >
            {opener}
        </SyntaxHighlighter>
    </ExpandableSiderSection>
);

export default OpenerSiderSection;
