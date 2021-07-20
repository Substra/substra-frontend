/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import CopyButton from '@/components/CopyButton';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

import { Spaces } from '@/assets/theme';

const copyButtonStyles = css`
    position: absolute;
    top: ${Spaces.medium};
    right: 0;
`;

const Key = styled.div`
    font-weight: bold;
`;

interface KeySiderSectionProps {
    assetKey: string;
}

const KeySiderSection = ({ assetKey }: KeySiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Key</SiderSectionTitle>
            <CopyButton css={copyButtonStyles} value={assetKey}>
                copy key
            </CopyButton>
            <Key>{assetKey}</Key>
        </SiderSection>
    );
};

export default KeySiderSection;
