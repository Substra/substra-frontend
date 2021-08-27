import TableFilter from './TableFilter';

import { AssetType } from '@/modules/common/CommonTypes';

import {
    areSearchFiltersListsEqual,
    SearchFilterType,
} from '@/libs/searchFilter';

import { useAppSelector } from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';

interface OwnerTableFilterProps {
    assets: AssetType[];
}
const OwnerTableFilter = ({ assets }: OwnerTableFilterProps): JSX.Element => {
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const nodes = useAppSelector((state) => state.nodes.nodes);
    const ownerFilterOptions: string[] = nodes.map((node) => node.id);

    const ownerFilterValue: string[] = searchFilters
        .filter(
            (filter) => assets.includes(filter.asset) && filter.key === 'owner'
        )
        .map((filter) => filter.value);

    const buildAssetFilters = (
        asset: AssetType,
        value: string[]
    ): SearchFilterType[] => {
        return value.map((v) => ({
            asset: asset,
            key: 'owner',
            value: v,
        }));
    };
    const setOwnerFilterValue = (value: string[]) => {
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

    return (
        <TableFilter
            options={ownerFilterOptions}
            value={ownerFilterValue}
            setValue={setOwnerFilterValue}
        />
    );
};

export default OwnerTableFilter;
