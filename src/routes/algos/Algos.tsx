/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment } from 'react';

import AlgoSider from './components/AlgoSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { listAlgos } from '@/modules/algos/AlgosSlice';
import { getAlgoCategory } from '@/modules/algos/AlgosUtils';

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

const categoryColWidth = css`
    width: 100px;
`;

const Algos = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const algos = useAppSelector((state) => state.algos.algos);
    const algosLoading = useAppSelector((state) => state.algos.algosLoading);
    const algosCount = useAppSelector((state) => state.algos.algosCount);

    useSearchFiltersEffect(() => {
        dispatch(listAlgos({ filters: searchFilters, page }));
    }, [searchFilters, page]);

    const key = useKeyFromPath(PATHS.ALGO);

    useAssetListDocumentTitleEffect('Algorithms list', key);

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
                                label: 'Algorithm',
                                value: 'algo',
                            },
                        ]}
                    />
                    <Table>
                        <Thead>
                            <Tr>
                                <CreationDateTh />
                                <Th css={categoryColWidth}>Category</Th>
                                <Th css={nameColWidth}>Name</Th>
                                <Th css={ownerColWidth}>
                                    Owner
                                    <OwnerTableFilter assets={['algo']} />
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
                        <Th css={categoryColWidth}>Category</Th>
                        <Th css={nameColWidth}>Name</Th>
                        <Th css={ownerColWidth}>Owner</Th>
                        <Th css={permissionsColWidth}>Permissions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!algosLoading && algosCount === 0 && (
                        <EmptyTr nbColumns={5} />
                    )}
                    {algosLoading ? (
                        <TableSkeleton
                            itemCount={algosCount}
                            currentPage={page}
                        >
                            <CreationDateSkeletonTd />
                            <Td>
                                <Skeleton width={80} height={12} />
                            </Td>
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
                        algos.map((algo) => (
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
                                <Td>{getAlgoCategory(algo)}</Td>
                                <Td>{algo.name}</Td>
                                <Td>{algo.owner}</Td>
                                <Td>
                                    <PermissionCellContent
                                        permissions={algo.permissions}
                                    />
                                </Td>
                            </Tr>
                        ))
                    )}
                    <TablePagination
                        colSpan={5}
                        currentPage={page}
                        itemCount={algosCount}
                        asset="algo"
                    />
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Algos;
