/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment, useState } from 'react';

import AlgoSider from './components/AlgoSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import {
    listAggregateAlgos,
    listAlgosArgs,
    listCompositeAlgos,
    listStandardAlgos,
} from '@/modules/algos/AlgosSlice';
import { AlgoT } from '@/modules/algos/AlgosTypes';
import { AssetType, PaginatedApiResponse } from '@/modules/common/CommonTypes';

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
    TableSkeleton,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
import TablePagination from '@/components/TablePagination';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';

import { Colors, Spaces } from '@/assets/theme';

interface TypeButtonProps {
    active: boolean;
}

const TypeButton = styled.button<TypeButtonProps>`
    background: ${({ active }) => (active ? Colors.primary : 'white')};
    border-color: ${({ active }) => (active ? Colors.primary : Colors.border)};
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    color: ${({ active }) => (active ? 'white' : Colors.lightContent)};
    height: 38px;
    margin-right: ${Spaces.medium};
    padding: ${Spaces.small} ${Spaces.medium};
    text-transform: uppercase;
`;

const AlgoButtonsContainer = styled.div`
    display: flex;
    margin: ${Spaces.medium} 0;
`;

interface selectedAlgoT {
    id: number;
    name: string;
    searchLabel: string;
    slug: AssetType;
    loading: boolean;
    list: AsyncThunkAction<
        PaginatedApiResponse<AlgoT>,
        listAlgosArgs,
        { rejectValue: string }
    >;
    algos: AlgoT[];
    count: number;
}

const Algos = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const [selectedAlgoType, setSelectedAlgoType] = useState(0);

    const algoTypes: selectedAlgoT[] = [
        {
            id: 0,
            name: 'Standard Algos',
            searchLabel: 'Standard Algo',
            slug: 'algo',
            loading: useAppSelector(
                (state) => state.algos.standardAlgosLoading
            ),
            list: listStandardAlgos({ filters: searchFilters, page }),
            algos: useAppSelector((state) => state.algos.standardAlgos),
            count: useAppSelector((state) => state.algos.standardAlgosCount),
        },
        {
            id: 1,
            name: 'Composite Algos',
            searchLabel: 'Composite Algo',
            slug: 'composite_algo',
            loading: useAppSelector(
                (state) => state.algos.compositeAlgosLoading
            ),
            list: listCompositeAlgos({ filters: searchFilters, page }),
            algos: useAppSelector((state) => state.algos.compositeAlgos),
            count: useAppSelector((state) => state.algos.compositeAlgosCount),
        },
        {
            id: 2,
            name: 'Aggregate Algos',
            searchLabel: 'Aggregate Algo',
            slug: 'aggregate_algo',
            loading: useAppSelector(
                (state) => state.algos.aggregateAlgosLoading
            ),
            list: listAggregateAlgos({ filters: searchFilters, page }),
            algos: useAppSelector((state) => state.algos.aggregateAlgos),
            count: useAppSelector((state) => state.algos.aggregateAlgosCount),
        },
    ];

    useSearchFiltersEffect(() => {
        dispatch(algoTypes[selectedAlgoType].list);
    }, [searchFilters, selectedAlgoType]);

    const key = useKeyFromPath(PATHS.ALGO);

    useAssetListDocumentTitleEffect('Algorithms list', key);

    const renderAlgosButtons = () => {
        return (
            <AlgoButtonsContainer>
                {algoTypes.map((algoType) => (
                    <TypeButton
                        onClick={() => setSelectedAlgoType(algoType.id)}
                        key={algoType.id}
                        active={selectedAlgoType === algoType.id}
                    >
                        {algoType.name}
                    </TypeButton>
                ))}
            </AlgoButtonsContainer>
        );
    };

    const pageTitleLinks = [
        { location: PATHS.ALGOS, title: 'Algorithms', active: true },
        { location: PATHS.METRICS, title: 'Metrics', active: false },
    ];
    return (
        <PageLayout
            siderVisible={!!key}
            navigation={<Navigation />}
            sider={<AlgoSider />}
            stickyHeader={
                <Fragment>
                    <PageTitle links={pageTitleLinks} />
                    <SearchBar
                        assetOptions={[
                            {
                                label: algoTypes[selectedAlgoType].name,
                                value: algoTypes[selectedAlgoType].slug,
                            },
                        ]}
                    />
                    {renderAlgosButtons()}
                    <Table>
                        <Thead>
                            <Tr>
                                <CreationDateTh />
                                <Th css={nameColWidth}>Name</Th>
                                <Th css={ownerColWidth}>
                                    Owner
                                    <OwnerTableFilter
                                        assets={[
                                            'algo',
                                            'composite_algo',
                                            'aggregate_algo',
                                        ]}
                                    />
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
            {renderAlgosButtons()}
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
                    {!algoTypes[selectedAlgoType].loading &&
                        algoTypes[selectedAlgoType].algos.length === 0 && (
                            <EmptyTr nbColumns={4} />
                        )}
                    {algoTypes[selectedAlgoType].loading ? (
                        <TableSkeleton
                            itemCount={algoTypes[selectedAlgoType].count}
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
                                <Skeleton width={150} height={12} />
                            </Td>
                        </TableSkeleton>
                    ) : (
                        algoTypes[selectedAlgoType].algos.map((algo) => (
                            <Tr
                                key={algo.key}
                                highlighted={algo.key === key}
                                onClick={() =>
                                    setLocationWithParams(
                                        compilePath(PATHS.ALGO, {
                                            key: algo.key,
                                        })
                                    )
                                }
                            >
                                <CreationDateTd
                                    creationDate={algo.creation_date}
                                />
                                <Td>{algo.name}</Td>
                                <Td>{algo.owner}</Td>
                                <Td>
                                    <PermissionCellContent
                                        permission={algo.permissions.process}
                                    />
                                </Td>
                            </Tr>
                        ))
                    )}
                    <TablePagination
                        colSpan={4}
                        currentPage={page}
                        itemCount={algoTypes[selectedAlgoType].count}
                        asset="algo"
                    />
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Algos;
