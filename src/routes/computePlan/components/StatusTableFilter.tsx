import React from 'react';

import { useSearchFiltersLocation } from '@/hooks';
import TableFilter from '@/components/TableFilter';
import { SearchFilterType } from '@/libs/searchFilter';
import { TaskStatus } from '@/modules/tasks/TasksTypes';

const StatusTableFilter = (): JSX.Element => {
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
            (filter) =>
                filter.asset === 'compute_plan' && filter.key === 'status'
        )
        .map((filter) => filter.value);

    const setValue = (value: string[]) => {
        const filters: SearchFilterType[] = value.map((v) => ({
            asset: 'compute_plan',
            key: 'status',
            value: v,
        }));
        setSearchFiltersLocation(filters);
    };

    return <TableFilter options={options} value={value} setValue={setValue} />;
};

export default StatusTableFilter;
