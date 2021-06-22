/** @jsx jsx */
import React, { useEffect, Fragment } from 'react';
import { useLocation } from 'wouter';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { unwrapResult } from '@reduxjs/toolkit';

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
import TupleSiderSection, {
    LoadingTupleSiderSection,
} from '@/components/TupleSiderSection';
import ExpandableSiderSection from '@/components/ExpandableSiderSection';
import Sider from '@/components/Sider';
import MetadataSiderSection, {
    LoadingMetadataSiderSection,
} from '@/components/MetadataSiderSection';
import Skeleton from '@/components/Skeleton';

const PercentageNumber = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: ${Fonts.weights.heavy};
    margin-bottom: ${Spaces.small};
`;

const TupleText = styled.div`
    padding: ${Spaces.medium} ${Spaces.large};
`;

const skeletonCss = css`
    margin: ${Spaces.small} 0;
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
    const computePlanLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );

    const computePlanTrainTuples = useAppSelector(
        (state) => state.computePlans.computePlanTrainTuples
    );

    const computePlanTrainTuplesLoading = useAppSelector(
        (state) => state.computePlans.computePlanTrainTuplesLoading
    );
    const computePlanTestTuplesLoading = useAppSelector(
        (state) => state.computePlans.computePlanTestTuplesLoading
    );
    const computePlanCompositeTuplesLoading = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTuplesLoading
    );
    const computePlanAggregateTuplesLoading = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTuplesLoading
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

            {computePlanLoading && <LoadingMetadataSiderSection />}
            {!computePlanLoading && computePlan && (
                <MetadataSiderSection metadata={computePlan.metadata} />
            )}

            <SiderSection>
                <SiderSectionTitle>Completion</SiderSectionTitle>
                {computePlanLoading && !computePlan && (
                    <Fragment>
                        <Skeleton css={skeletonCss} width={50} height={16} />
                        <Skeleton css={skeletonCss} width={200} height={16} />
                    </Fragment>
                )}
                {!computePlanLoading && computePlan && (
                    <Fragment>
                        <PercentageNumber>{percentage}%</PercentageNumber>
                        <ProgressBar percentage={percentage} />
                    </Fragment>
                )}
            </SiderSection>

            <ExpandableSiderSection title="Train tuples">
                {computePlanTrainTuplesLoading && <LoadingTupleSiderSection />}
                {!computePlanTrainTuplesLoading &&
                    computePlanTrainTuples.length === 0 && (
                        <TupleText>
                            This compute plan doesn't have any traintuples
                            attached
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
                {computePlanTestTuplesLoading && <LoadingTupleSiderSection />}
                {!computePlanTestTuplesLoading &&
                    computePlanTestTuples.length === 0 && (
                        <TupleText>
                            This compute plan doesn't have any testtuples
                            attached
                        </TupleText>
                    )}
                {computePlanTestTuples.map((testTuple) => (
                    <TupleSiderSection key={testTuple.key} tuple={testTuple} />
                ))}
            </ExpandableSiderSection>
            <ExpandableSiderSection title="Composite tuples">
                {computePlanCompositeTuplesLoading && (
                    <LoadingTupleSiderSection />
                )}
                {!computePlanCompositeTuplesLoading &&
                    computePlanCompositeTuples.length === 0 && (
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
                {computePlanAggregateTuplesLoading && (
                    <LoadingTupleSiderSection />
                )}
                {!computePlanAggregateTuplesLoading &&
                    computePlanAggregateTuples.length === 0 && (
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
