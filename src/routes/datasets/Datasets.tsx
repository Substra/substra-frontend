/** @jsx jsx */
import React, { useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '@/hooks';
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
