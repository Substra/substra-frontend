import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { DatasetType, PermissionType } from '@/modules/datasets/DatasetsTypes';
import { listDatasets } from '@/modules/datasets/DatasetsSlice';
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';
import { RootState, useAppDispatch } from '@/store';

const Datasets = (): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(listDatasets());
    }, [dispatch]);

    const datasets: DatasetType[] = useSelector(
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

    return (
        <PageLayout navigation={<Navigation />}>
            <div>DATASETS</div>
            <table>
                <thead>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Permissions</th>
                    <th>Train data samples</th>
                    <th>Test data samples</th>
                </thead>
                <tbody>
                    {datasets.map((dataset) => (
                        <tr key={dataset.key}>
                            <td>{dataset.name}</td>
                            <td>{dataset.owner}</td>
                            <td>
                                {permissionFormatter(
                                    dataset.permissions.process
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PageLayout>
    );
};

export default Datasets;
