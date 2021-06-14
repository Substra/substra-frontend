import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import styled from '@emotion/styled';

import { Fonts, Spaces } from '@/assets/theme';
import KeySiderSection from '@/components/KeySiderSection';
import {
    retrieveComputePlan,
    retrieveComputePlanAggregateTuples,
    retrieveComputePlanCompositeTuples,
    retrieveComputePlanTestTuples,
    retrieveComputePlanTrainTuples,
} from '@/modules/computePlans/ComputePlansSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import ProgressBar from '@/components/ProgressBar';
import { unwrapResult } from '@reduxjs/toolkit';
import TupleSiderSection from '@/components/TupleSiderSection';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import Sider from '@/components/Sider';

const PercentageNumber = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: ${Fonts.weights.heavy};
    margin-bottom: ${Spaces.small};
`;

const TupleText = styled.div`
    padding: ${Spaces.medium} ${Spaces.large};
`;

const ComputePlanSider = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    const visible = !!key;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (key) {
            dispatch(retrieveComputePlan(key))
                .then(unwrapResult)
                .then((computePlan) => {
                    dispatch(retrieveComputePlanTrainTuples(computePlan.key));
                    dispatch(retrieveComputePlanTestTuples(computePlan.key));
                    dispatch(
                        retrieveComputePlanAggregateTuples(computePlan.key)
                    );
                    dispatch(
                        retrieveComputePlanCompositeTuples(computePlan.key)
                    );
                });
        }
    }, [key]);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const computePlanTrainTuples = useAppSelector(
        (state) => state.computePlans.computePlanTrainTuples
    );

    const computePlanTestTuples = useAppSelector(
        (state) => state.computePlans.computePlanTestTuples
    );

    const computePlanCompositeTuples = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTuples
    );

    const computePlanAggregateTuples = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTuples
    );

    let percentage = 0;
    if (computePlan) {
        percentage = (computePlan.done_count / computePlan.tuple_count) * 100;
    }

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() => setLocation(PATHS.COMPUTE_PLANS)}
            titleType="Compute plan details"
            title=""
        >
            <KeySiderSection assetKey={key || ''} />
            <SiderSection>
                <SiderSectionTitle>Completion</SiderSectionTitle>
                <PercentageNumber>{percentage}%</PercentageNumber>
                <ProgressBar percentage={percentage} />
            </SiderSection>
            <ExpandableSiderSection title="Train tuples">
                {computePlanTrainTuples.length === 0 && (
                    <TupleText>
                        This compute plan doesn't have any traintuples attached
                    </TupleText>
                )}
                {computePlanTrainTuples.map((trainTuple) => (
                    <TupleSiderSection
                        key={trainTuple.key}
                        tuple={trainTuple}
                    />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Test tuples">
                {computePlanTestTuples.length === 0 && (
                    <TupleText>
                        This compute plan doesn't have any testtuples attached
                    </TupleText>
                )}
                {computePlanTestTuples.map((testTuple) => (
                    <TupleSiderSection key={testTuple.key} tuple={testTuple} />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Composite tuples">
                {computePlanCompositeTuples.length === 0 && (
                    <TupleText>
                        This compute plan doesn't have any composite tuples
                        attached
                    </TupleText>
                )}
                {computePlanCompositeTuples.map((compositeTuple) => (
                    <TupleSiderSection
                        key={compositeTuple.key}
                        tuple={compositeTuple}
                    />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Aggregate tuples">
                {computePlanAggregateTuples.length === 0 && (
                    <TupleText>
                        This compute plan doesn't have any aggregate tuples
                        attached
                    </TupleText>
                )}
                {computePlanAggregateTuples.map((aggregateTuple) => (
                    <TupleSiderSection
                        key={aggregateTuple.key}
                        tuple={aggregateTuple}
                    />
                ))}
            </ExpandableSiderSection>
        </Sider>
    );
};

export default ComputePlanSider;
