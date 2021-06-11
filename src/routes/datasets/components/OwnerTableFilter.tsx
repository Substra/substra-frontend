import React from 'react';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { useAppSelector, useSearchFilters } from '@/hooks';
import TableFilter from '@/components/TableFilter';
import { SearchFilterType } from '@/libs/searchFilter';

const OwnerTableFilter = (): JSX.Element => {
    const [searchFilters, setSearchFilters] = useSearchFilters();

    const datasets: DatasetStubType[] = useAppSelector(
        (state) => state.datasets.datasets
    );

    const ownerFilterOptions: string[] = datasets.reduce(
        (allOwners: string[], dataset) => {
            if (!allOwners.includes(dataset.owner)) {
                allOwners.push(dataset.owner);
            }
            return allOwners;
        },
        []
    );

    const ownerFilterValue: string[] = searchFilters
        .filter(
            (filter) => filter.asset === 'dataset' && filter.key === 'owner'
        )
        .map((filter) => filter.value);

    const setOwnerFilterValue = (value: string[]) => {
        const filters: SearchFilterType[] = value.map((v) => ({
            asset: 'dataset',
            key: 'owner',
            value: v,
        }));
        setSearchFilters(filters);
    };

    return (
        <TableFilter
            options={ownerFilterOptions}
            value={ownerFilterValue}
            setValue={setOwnerFilterValue}
        />
    );
};

export default OwnerTableFilter;
