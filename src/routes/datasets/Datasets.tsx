/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment } from 'react';

import DatasetSider from './components/DatasetSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import {
    CreationDateSkeletonTd,
    CreationDateTd,
    CreationDateTh,
} from '@/components/CreationDateTableCells';
import OwnerTableFilter from '@/components/OwnerTableFilter';
import PageTitle from '@/components/PageTitle';
import PermissionCellContent from '@/components/PermissionCellContent';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import {
    EmptyTr,
    nameColWidth,
    ownerColWidth,
    permissionsColWidth,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    TableSkeleton,
} from '@/components/Table';
import TablePagination from '@/components/TablePagination';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';

const Datasets = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    useSearchFiltersEffect(() => {
        dispatch(listDatasets({ filters: searchFilters, page }));
    }, [searchFilters, page]);

    const datasets: DatasetStubType[] = useAppSelector(
        (state) => state.datasets.datasets
    );
    const datasetsLoading = useAppSelector(
        (state) => state.datasets.datasetsLoading
    );
    const datasetsCount = useAppSelector(
        (state) => state.datasets.datasetsCount
    );
    const key = useKeyFromPath(PATHS.DATASET);

    useAssetListDocumentTitleEffect('Datasets list', key);

    const pageTitleLinks = [
        { location: PATHS.DATASETS, title: 'Datasets', active: true },
    ];

    return (
        <PageLayout
            navigation={<Navigation />}
            sider={<DatasetSider />}
            siderVisible={!!key}
            stickyHeader={
                <Fragment>
                    <PageTitle links={pageTitleLinks} />
                    <SearchBar
                        assetOptions={[{ label: 'Dataset', value: 'dataset' }]}
                    />
                    <Table>
                        <Thead>
                            <Tr>
                                <CreationDateTh />
                                <Th css={nameColWidth}>Name</Th>
                                <Th css={ownerColWidth}>
                                    Owner
                                    <OwnerTableFilter assets={['dataset']} />
                                </Th>
                                <Th css={permissionsColWidth}>Permissions</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle
                links={pageTitleLinks}
                css={css`
                    opacity: 0;
                    pointer-events: none;
                `}
            />
            <Table>
                <Thead
                    css={css`
                        opacity: 0;
                        pointer-events: none;
                    `}
                >
                    <Tr>
                        <CreationDateTh />
                        <Th css={nameColWidth}>Name</Th>
                        <Th css={ownerColWidth}>Owner</Th>
                        <Th css={permissionsColWidth}>Permissions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!datasetsLoading && datasets.length === 0 && (
                        <EmptyTr nbColumns={4} />
                    )}
                    {datasetsLoading ? (
                        <TableSkeleton
                            itemCount={datasetsCount}
                            currentPage={page}
                        >
                            <CreationDateSkeletonTd />
                            <Td>
                                <Skeleton width={500} height={12} />
                            </Td>
                            <Td>
                                <Skeleton width={80} height={12} />
                            </Td>
                            <Td>
                                <Skeleton width={120} height={12} />
                            </Td>
                        </TableSkeleton>
                    ) : (
                        datasets.map((dataset) => (
                            <Tr
                                key={dataset.key}
                                highlighted={dataset.key === key}
                                onClick={() =>
                                    setLocationWithParams(
                                        compilePath(PATHS.DATASET, {
                                            key: dataset.key,
                                        })
                                    )
                                }
                            >
                                <CreationDateTd
                                    creationDate={dataset.creation_date}
                                />
                                <Td>{dataset.name}</Td>
                                <Td>{dataset.owner}</Td>
                                <Td>
                                    <PermissionCellContent
                                        permissions={dataset.permissions}
                                    />
                                </Td>
                            </Tr>
                        ))
                    )}
                    <TablePagination
                        colSpan={4}
                        currentPage={page}
                        itemCount={datasetsCount}
                        asset="dataset"
                    />
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Datasets;
