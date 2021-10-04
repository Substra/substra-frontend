import TableFilter from './TableFilter';

import { AssetType } from '@/modules/common/CommonTypes';

import {
    areSearchFiltersListsEqual,
    SearchFilterType,
} from '@/libs/searchFilter';

import { useAppSelector } from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';

interface BaseNodeTableFilterProps {
    assetKey: string;
    assets: AssetType[];
}
const BaseNodeTableFilter = ({
    assets,
    assetKey,
}: BaseNodeTableFilterProps): JSX.Element => {
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const nodes = useAppSelector((state) => state.nodes.nodes);
    const filterOptions: string[] = nodes.map((node) => node.id);

    const filterValue: string[] = searchFilters
        .filter(
            (filter) => assets.includes(filter.asset) && filter.key === assetKey
        )
        .map((filter) => filter.value);

    const buildAssetFilters = (
        asset: AssetType,
        value: string[]
    ): SearchFilterType[] => {
        return value.map((v) => ({
            asset: asset,
            key: assetKey,
            value: v,
        }));
    };
    const setFilterValue = (value: string[]) => {
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
            options={filterOptions}
            value={filterValue}
            setValue={setFilterValue}
        />
    );
};

interface NodeTableFilterProps {
    assets: AssetType[];
}

export const WorkerTableFilter = ({
    assets,
}: NodeTableFilterProps): JSX.Element => (
    <BaseNodeTableFilter assetKey="worker" assets={assets} />
);
export const OwnerTableFilter = ({
    assets,
}: NodeTableFilterProps): JSX.Element => (
    <BaseNodeTableFilter assetKey="owner" assets={assets} />
);
