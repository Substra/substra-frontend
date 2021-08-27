import { AssetType } from '@/modules/common/CommonTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import {
    areSearchFiltersListsEqual,
    SearchFilterType,
} from '@/libs/searchFilter';

import useLocationWithParams from '@/hooks/useLocationWithParams';

import TableFilter from '@/components/TableFilter';

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
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const options = [
        TupleStatus.canceled,
        TupleStatus.doing,
        TupleStatus.done,
        TupleStatus.failed,
        TupleStatus.todo,
        TupleStatus.waiting,
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
        if (!areSearchFiltersListsEqual(searchFilters, filters)) {
            setLocationWithParams({ search: filters, page: 1 });
        }
    };

    return <TableFilter options={options} value={value} setValue={setValue} />;
};

export default StatusTableFilter;
