import React from 'react';

import { useSearchFiltersLocation } from '@/hooks';
import TableFilter from '@/components/TableFilter';
import { SearchFilterType } from '@/libs/searchFilter';
import { TaskStatus } from '@/modules/tasks/TasksTypes';
import { AssetType } from '@/modules/common/CommonTypes';

const buildAssetFilters = (
    asset: AssetType,
    value: string[]
): SearchFilterType[] => {
    return value.map((v) => ({
        asset: asset,
        key: 'status',
        value: v,
    }));
};

interface StatusTableFilterProps {
    assets: AssetType[];
}
const StatusTableFilter = ({ assets }: StatusTableFilterProps): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    const options = [
        TaskStatus.canceled,
        TaskStatus.doing,
        TaskStatus.done,
        TaskStatus.failed,
        TaskStatus.todo,
        TaskStatus.waiting,
    ];

    const value: string[] = searchFilters
        .filter(
            (filter) => assets.includes(filter.asset) && filter.key === 'status'
        )
        .map((filter) => filter.value);

    const setValue = (value: string[]) => {
        const filters = assets.reduce(
            (filters: SearchFilterType[], asset: AssetType) => {
                return [...filters, ...buildAssetFilters(asset, value)];
            },
            []
        );
        setSearchFiltersLocation(filters);
    };

    return <TableFilter options={options} value={value} setValue={setValue} />;
};

export default StatusTableFilter;
