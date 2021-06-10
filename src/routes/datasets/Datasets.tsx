/** @jsx jsx */
import React, { useEffect, Fragment } from 'react';
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
import { Colors } from '@/assets/theme';
import DatasetSider from './components/DatasetSider';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import PageTitle from '@/components/PageTitle';
import Skeleton from '@/components/Skeleton';

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
    const datasetsLoading = useAppSelector(
        (state) => state.datasets.datasetsLoading
    );
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.DATASET);

    return (
        <PageLayout
            navigation={<Navigation />}
            sider={<DatasetSider />}
            siderVisible={!!key}
            stickyHeader={
                <Fragment>
                    <PageTitle>Datasets</PageTitle>
                    <Table>
                        <Thead>
                            <Tr>
                                <FirstTabTh css={nameColWidth}>Name</FirstTabTh>
                                <Th css={ownerColWidth}>Owner</Th>
                                <Th css={permissionsColWidth}>Permissions</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle
                css={css`
                    opacity: 0;
                    pointer-events: none;
                `}
            >
                Datasets
            </PageTitle>
            <Table>
                <Thead
                    css={css`
                        opacity: 0;
                        pointer-events: none;
                    `}
                >
                    <Tr>
                        <FirstTabTh css={nameColWidth}>Name</FirstTabTh>
                        <Th css={ownerColWidth}>Owner</Th>
                        <Th css={permissionsColWidth}>Permissions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {datasetsLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
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
                                  css={[
                                      dataset.key === key &&
                                          highlightedTrStyles,
                                  ]}
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
