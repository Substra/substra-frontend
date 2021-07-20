/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import ReactMarkdown from 'react-markdown';

import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';

import { Spaces } from '@/assets/theme';

export const LoadingDescriptionSiderSection = (): JSX.Element => (
    <SiderSection>
        <SiderSectionTitle>Description</SiderSectionTitle>
        <Skeleton
            width={300}
            height={16}
            css={css`
                margin-bottom: ${Spaces.extraSmall};
            `}
        />
        <Skeleton width={250} height={16} />
    </SiderSection>
);

interface DescriptionSiderSectionProps {
    description: string;
}

const DescriptionSiderSection = ({
    description,
}: DescriptionSiderSectionProps): JSX.Element => (
    <ExpandableSiderSection title="Description">
        <ReactMarkdown children={description} />
    </ExpandableSiderSection>
);

export default DescriptionSiderSection;
