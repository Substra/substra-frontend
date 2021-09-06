import { AssetType } from '@/modules/common/CommonTypes';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import {
    areSearchFiltersListsEqual,
    SearchFilterType,
} from '@/libs/searchFilter';
import { getStatusFromLabel, getStatusLabel, StatusLabel } from '@/libs/status';

import useLocationWithParams from '@/hooks/useLocationWithParams';

import TableFilter from '@/components/TableFilter';

const buildAssetFilters = (
    asset: AssetType,
    value: string[]
): SearchFilterType[] => {
    return value.map((v) => ({
        asset: asset,
        key: 'status',
        value: getStatusFromLabel(asset, v as StatusLabel),
    }));
};

interface StatusTableFilterProps {
    asset: AssetType;
}
const StatusTableFilter = ({ asset }: StatusTableFilterProps): JSX.Element => {
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const value: string[] = searchFilters
        .filter((filter) => filter.asset === asset && filter.key === 'status')
        .map((filter) =>
            getStatusLabel(filter.value as TupleStatus | ComputePlanStatus)
        );

    const setValue = (value: string[]) => {
        const filters = buildAssetFilters(asset, value);
        if (!areSearchFiltersListsEqual(searchFilters, filters)) {
            setLocationWithParams({ search: filters, page: 1 });
        }
    };

    return (
        <TableFilter
            options={Object.values(StatusLabel)}
            value={value}
            setValue={setValue}
        />
    );
};

export default StatusTableFilter;
