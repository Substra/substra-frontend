/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';
import { Spaces } from '@/assets/theme';

const LoadingSiderSection = (): JSX.Element => (
    <SiderSection>
        <SiderSectionTitle>
            <Skeleton width={75} height={12} />
        </SiderSectionTitle>

        <Skeleton
            width={250}
            height={16}
            css={css`
                margin-bottom: ${Spaces.extraSmall};
            `}
        />
        <Skeleton width={250} height={16} />
    </SiderSection>
);
export default LoadingSiderSection;
