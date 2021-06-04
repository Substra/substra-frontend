/** @jsx jsx */
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import PermissionCellContent from '@/components/PermissionCellContent';
import {
    FirstTabTh,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
import { Colors } from '@/assets/theme';
import DatasetSider from './components/DatasetSider';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import PageTitle from '@/components/PageTitle';

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

    const datasets: DatasetStubType[] = useAppSelector(
        (state) => state.datasets.datasets
    );
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
                                <PermissionCellContent
                                    permission={dataset.permissions.process}
                                />
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
