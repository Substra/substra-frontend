/** @jsx jsx */
import React, { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';
import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { RootState, useAppDispatch } from '@/store';
import { useSelector } from 'react-redux';
import Navigation from '@/components/layout/navigation/Navigation';
import PageLayout from '@/components/layout/PageLayout';
// import ProgressBar from '@/components/ProgressBar';
import { Colors, Spaces } from '@/assets/theme';
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

const ComputePlan = (): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listComputePlans());
    }, [dispatch]);

    const computePlans: ComputePlanType[] = useSelector(
        (state: RootState) => state.computePlans.computePlans
    );

    interface StatusProps {
        status: string;
    }
    const Status = ({ status }: StatusProps): JSX.Element => {
        let color;

        switch (status) {
            case 'doing':
                color = Colors.running;
                break;
            case 'done':
                color = Colors.success;
                break;
            case 'failed':
                color = Colors.error;
                break;
            case 'canceled':
                color = Colors.lightContent;
        }

        const StatusStyle = css`
            display: flex;
            flex-direction: flex-row;
            align-items: center;

            & > span {
                color: ${color};
                margin-left: ${Spaces.extraSmall};
            }
        `;

        return (
            <div css={StatusStyle}>
                <span>{status.toUpperCase()}</span>
            </div>
        );
    };

    return (
        <PageLayout navigation={<Navigation />}>
            <PageTitle>Compute Plan</PageTitle>
            <Table>
                <Thead>
                    <Tr>
                        <FirstTabTh>Status</FirstTabTh>
                        <Th>Tasks</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {computePlans.map((computePlan) => (
                        <Tr key={computePlan.key}>
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
