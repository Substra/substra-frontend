/** @jsx jsx */
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { AlgoType } from '@/modules/algos/AlgosTypes';
import { listAlgos } from '@/modules/algos/AlgosSlice';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/hooks';
import PermissionCellContent from '@/components/PermissionCellContent';
import {
    EmptyTr,
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
import AlgoSider from './components/AlgoSider';
import { compilePath, PATHS, useKeyFromPath } from '@/routes';
import PageTitle from '@/components/PageTitle';
import Skeleton from '@/components/Skeleton';

const typeColWidth = css`
    width: 110px;
`;

const Algos = (): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listAlgos());
    }, [dispatch]);

    const algos: AlgoType[] = useAppSelector(
        (state: RootState) => state.algos.algos
    );

    const algosLoading = useAppSelector(
        (state: RootState) => state.algos.algosLoading
    );

    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.ALGO);

    return (
        <PageLayout
            siderVisible={!!key}
            navigation={<Navigation />}
            sider={<AlgoSider />}
        >
            <PageTitle>Algorithms</PageTitle>
            <Table>
                <Thead>
                    <Tr>
                        <FirstTabTh css={nameColWidth}>Name</FirstTabTh>
                        <Th css={ownerColWidth}>Owner</Th>
                        <Th css={permissionsColWidth}>Permissions</Th>
                        <Th css={typeColWidth}>Type</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {!algosLoading && algos.length === 0 && (
                        <EmptyTr nbColumns={4} />
                    )}
                    {algosLoading
                        ? [1, 2, 3].map((index) => (
                              <Tr key={index}>
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
                                      setLocation(
                                          compilePath(PATHS.ALGO, {
                                              key: algo.key,
                                          })
                                      )
                                  }
                              >
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
