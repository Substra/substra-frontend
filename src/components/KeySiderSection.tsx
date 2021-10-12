import styled from '@emotion/styled';

import CopyButton from '@/components/CopyButton';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

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
            <CopyButton value={assetKey} />
            <Key>{assetKey}</Key>
        </SiderSection>
    );
};

export default KeySiderSection;
