import { AssetType } from '@/modules/common/CommonTypes';

import { SearchFilterType } from '@/libs/searchFilter';

import useLocationWithParams from '@/hooks/useLocationWithParams';

import TableFilter from '@/components/TableFilter';

const buildAssetFilters = (
    asset: AssetType,
    value: string[]
): SearchFilterType[] => {
    return value.map((v) => ({
        asset: asset,
        key: 'type',
        value: v,
    }));
};

interface TypeTableFilterProps {
    assets: AssetType[];
}
const TypeTableFilter = ({ assets }: TypeTableFilterProps): JSX.Element => {
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const options = [
        'traintuple',
        'composite_traintuple',
        'aggregatetuple',
        'testtuple',
    ];

    const value: string[] = searchFilters
        .filter(
            (filter) => assets.includes(filter.asset) && filter.key === 'type'
        )
        .map((filter) => filter.value);

    const setValue = (value: string[]) => {
        const filters = assets.reduce(
            (filters: SearchFilterType[], asset: AssetType) => {
                return [...filters, ...buildAssetFilters(asset, value)];
            },
            []
        );
        setLocationWithParams({ search: filters });
    };

    return <TableFilter options={options} value={value} setValue={setValue} />;
};

export default TypeTableFilter;
