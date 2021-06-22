/** @jsx jsx */
import React from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { Fonts, Spaces } from '@/assets/theme';
import Status from './Status';
import { TupleType } from '@/modules/tuples/TuplesTypes';
import Skeleton from '@/components/Skeleton';

export const LoadingTupleSiderSection = (): JSX.Element => (
    <TupleSiderSectionContainer>
        <Skeleton
            width={200}
            height={16}
            css={css`
                margin-bottom: ${Spaces.extraSmall};
            `}
        />
        <Skeleton
            width={300}
            height={16}
            css={css`
                margin-bottom: ${Spaces.small};
            `}
        />
        <Skeleton
            width={200}
            height={12}
            css={css`
                margin-bottom: ${Spaces.small};
            `}
        />
    </TupleSiderSectionContainer>
);

const TupleSiderSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${Spaces.small} ${Spaces.large};
`;

const Key = styled.span`
    margin: ${Spaces.small} 0;
    font-weight: ${Fonts.weights.heavy};
    font-size: ${Fonts.sizes.input};
`;

const WorkerSection = styled.div`
    font-size: ${Fonts.sizes.label};
    margin-bottom: ${Spaces.small};
`;

const Worker = styled.span`
    font-weight: ${Fonts.weights.heavy};
    margin-left: ${Spaces.extraSmall};
`;

type TupleSiderSectionProps = {
    tuple: TupleType;
};

const TupleSiderSection = ({ tuple }: TupleSiderSectionProps): JSX.Element => {
    return (
        <TupleSiderSectionContainer>
            <Status status={tuple.status} />
            <Key>{tuple.key}</Key>
            <WorkerSection>
                worker:
                <Worker>{tuple.creator}</Worker>
            </WorkerSection>
        </TupleSiderSectionContainer>
    );
};

export default TupleSiderSection;
