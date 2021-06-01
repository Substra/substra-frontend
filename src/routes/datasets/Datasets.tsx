/** @jsx jsx */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { useLocation } from 'wouter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import {
    DatasetStubType,
    PermissionType,
} from '@/modules/datasets/DatasetsTypes';
import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';
import { RootState, useAppDispatch } from '@/store';
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
import DatasetSider from './components/DatasetSider';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';

const PageTitle = styled.div`
    display: inline-block;
    color: ${Colors.primary};
    font-weight: bold;
    font-size: 14px;
    border: 1px solid ${Colors.border};
    border-bottom-color: white;
    border-radius: ${Spaces.medium} ${Spaces.medium} 0 0;
    padding: ${Spaces.medium} ${Spaces.xxl} ${Spaces.small} ${Spaces.xxl};
    background-color: white;
    margin-bottom: -1px;
`;

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

const Datasets = (): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listDatasets());
    }, [dispatch]);

    const datasets: DatasetStubType[] = useSelector(
        (state: RootState) => state.datasets.datasets
    );
    const permissionFormatter = (permission: PermissionType): string => {
        if (permission.public) {
            return 'Processable by anyone';
        }

        if (!permission.authorized_ids.length) {
            return 'Processable by its owner only';
        }

        return 'restricted';
    };

    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.DATASET);

    return (
        <PageLayout navigation={<Navigation />} sider={<DatasetSider />}>
            <PageTitle>Datasets</PageTitle>
            <Table>
                <Thead>
                    <Tr>
                        <FirstTabTh>Name</FirstTabTh>
                        <Th>Owner</Th>
                        <Th>Permissions</Th>
                        <Th>Train data samples</Th>
                        <Th>Test data samples</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {datasets.map((dataset) => (
                        <Tr
                            key={dataset.key}
                            css={[dataset.key === key && highlightedTrStyles]}
                            onClick={() =>
                                setLocation(
                                    compilePath(PATHS.DATASET, {
                                        key: dataset.key,
                                    })
                                )
                            }
                        >
                            <Td>{dataset.name}</Td>
                            <Td>{dataset.owner}</Td>
                            <Td>
                                {permissionFormatter(
                                    dataset.permissions.process
                                )}
                            </Td>
                            <Td>N/A</Td>
                            <Td>N/A</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Datasets;
