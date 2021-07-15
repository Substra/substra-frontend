/** @jsxRuntime classic */
/** @jsx jsx */
import { Fragment } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';
import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';
import PermissionCellContent from '@/components/PermissionCellContent';
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
import DatasetSider from './components/DatasetSider';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import PageTitle from '@/components/PageTitle';
import Skeleton from '@/components/Skeleton';
import SearchBar from '@/components/SearchBar';
import OwnerTableFilter from '@/components/OwnerTableFilter';
import {
    CreationDateSkeletonTd,
    CreationDateTd,
    CreationDateTh,
} from '@/components/CreationDateTableCells';

const Datasets = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    useSearchFiltersEffect(() => {
        dispatch(listDatasets(searchFilters));
    }, [searchFilters]);

    const datasets: DatasetStubType[] = useAppSelector(
        (state) => state.datasets.datasets
    );
    const datasetsLoading = useAppSelector(
        (state) => state.datasets.datasetsLoading
    );
    const key = useKeyFromPath(PATHS.DATASET);

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
                        <EmptyTr nbColumns={3} />
                    )}
                    {datasetsLoading
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
                                      <Skeleton width={120} height={12} />
                                  </Td>
                              </Tr>
                          ))
                        : datasets.map((dataset) => (
                              <Tr
                                  key={dataset.key}
                                  highlighted={dataset.key === key}
                                  onClick={() =>
                                      setSearchFiltersLocation(
                                          compilePath(PATHS.DATASET, {
                                              key: dataset.key,
                                          }),
                                          searchFilters
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
                                          permission={
                                              dataset.permissions.process
                                          }
                                      />
                                  </Td>
                              </Tr>
                          ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Datasets;
