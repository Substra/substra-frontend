import React from 'react';
import styled from '@emotion/styled';
import { Fonts, Spaces } from '@/assets/theme';
import Status from './Status';
import { TupleType } from '@/modules/tuples/TuplesTypes';

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
