/** @jsx jsx */
import React, { Fragment, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { useLocation } from 'wouter';

import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import Navigation from '@/components/layout/navigation/Navigation';
import PageLayout from '@/components/layout/PageLayout';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import { Colors } from '@/assets/theme';
import {
    FirstTabTh,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
import PageTitle from '@/components/PageTitle';
import ComputePlanSider from './components/ComputePlanSider';
import Status from '@/components/Status';

const highlightedTrStyles = css`
    & > td > div {
        background-color: ${Colors.darkerBackground};
        border-color: ${Colors.primary} transparent;
    }

    & > td:first-of-type > div {
        border-left-color: ${Colors.primary};
    }

    & > td:last-of-type > div {
        border-right-color: ${Colors.primary};
    }
`;

const statusColWidth = css`
    width: 200px;
`;
const taskColWidth = css`
    width: 400px;
`;

const ComputePlan = (): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listComputePlans());
    }, [dispatch]);

    const computePlans: ComputePlanType[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    return (
        <PageLayout
            navigation={<Navigation />}
            sider={<ComputePlanSider />}
            siderVisible={!!key}
            stickyHeader={
                <Fragment>
                    <PageTitle>Compute Plans</PageTitle>
                    <Table>
                        <Thead>
                            <Tr>
                                <FirstTabTh css={statusColWidth}>
                                    Status
                                </FirstTabTh>
                                <Th css={taskColWidth}>Tasks</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle>Compute Plan</PageTitle>
            <Table>
                <Thead>
                    <Tr>
                        <FirstTabTh css={statusColWidth}>Status</FirstTabTh>
                        <Th css={taskColWidth}>Tasks</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {computePlans.map((computePlan) => (
                        <Tr
                            key={computePlan.key}
                            css={[
                                computePlan.key === key && highlightedTrStyles,
                            ]}
                            onClick={() =>
                                setLocation(
                                    compilePath(PATHS.COMPUTE_PLAN, {
                                        key: computePlan.key,
                                    })
                                )
                            }
                        >
                            <Td>
                                <Status status={computePlan.status} />
                            </Td>
                            <Td>
                                {computePlan.done_count}/
                                {computePlan.tuple_count}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default ComputePlan;
