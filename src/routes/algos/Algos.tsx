/** @jsxRuntime classic */

/** @jsx jsx */
import { RootState } from '@/store';

import { Fragment } from 'react';

import AlgoSider from './components/AlgoSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { listAlgos } from '@/modules/algos/AlgosSlice';
import { AlgoType } from '@/modules/algos/AlgosTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';

import { compilePath, PATHS, useKeyFromPath } from '@/routes';

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
} from '@/components/Table';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';

const typeColWidth = css`
    width: 110px;
`;

const Algos = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    useSearchFiltersEffect(() => {
        dispatch(listAlgos(searchFilters));
    }, [searchFilters]);

    const algos: AlgoType[] = useAppSelector(
        (state: RootState) => state.algos.algos
    );

    const algosLoading = useAppSelector(
        (state: RootState) => state.algos.algosLoading
    );

    const key = useKeyFromPath(PATHS.ALGO);

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
                            { label: 'Standard Algo', value: 'algo' },
                            {
                                label: 'Composite Algo',
                                value: 'composite_algo',
                            },
                            {
                                label: 'Aggregate Algo',
                                value: 'aggregate_algo',
                            },
                        ]}
                    />
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
                                <Th css={typeColWidth}>Type</Th>
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
                        <Th css={typeColWidth}>Type</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!algosLoading && algos.length === 0 && (
                        <EmptyTr nbColumns={5} />
                    )}
                    {algosLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
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
                                  <Td>
                                      <Skeleton width={60} height={12} />
                                  </Td>
                              </Tr>
                          ))
                        : algos.map((algo) => (
                              <Tr
                                  key={algo.key}
                                  highlighted={algo.key === key}
                                  onClick={() =>
                                      setSearchFiltersLocation(
                                          compilePath(PATHS.ALGO, {
                                              key: algo.key,
                                          }),
                                          searchFilters
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
                                  <Td>{algo.type}</Td>
                              </Tr>
                          ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Algos;
