import { AssetType } from '@/modules/common/CommonTypes';

import { SearchFilterType } from '@/libs/searchFilter';

import { useAppSelector, useSearchFiltersLocation } from '@/hooks';

import TableFilter from '@/components/TableFilter';

interface OwnerTableFilterProps {
    assets: AssetType[];
}
const OwnerTableFilter = ({ assets }: OwnerTableFilterProps): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

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
        setSearchFiltersLocation(filters);
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
