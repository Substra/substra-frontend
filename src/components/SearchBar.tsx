import { useState } from 'react';

import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';

import { AssetType } from '@/modules/common/CommonTypes';

import { SearchFilterType } from '@/libs/searchFilter';

import { useSearchFiltersEffect } from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';

interface SearchBarProps {
    asset: AssetType;
}
const SearchBar = ({ asset }: SearchBarProps): JSX.Element => {
    const [value, setValue] = useState('');

    const { params, setLocationWithParams } = useLocationWithParams();
    const searchFilters = params.search;

    useSearchFiltersEffect(() => {
        // filters that can be created with this search bar:
        // - only on key
        // - only for assets that can be selected
        const keySearchFilters = searchFilters.filter(
            (sf) => sf.key === 'key' && asset === sf.asset
        );
        if (keySearchFilters.length) {
            const keySearchFilter = keySearchFilters[0];
            setValue(keySearchFilter.value);
        }
    }, [searchFilters]);

    const applySearchFilters = (asset: string) => {
        // preserve all filters that are not on asset key
        const newSearchFilters: SearchFilterType[] = searchFilters.filter(
            (sf) => sf.key !== 'key'
        );
        if (value) {
            newSearchFilters.push({
                asset: asset as AssetType,
                key: 'key',
                value,
            });
        }
        setLocationWithParams({ search: newSearchFilters, page: 1 });
    };

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        applySearchFilters(asset);
    };

    return (
        <form onSubmit={onSubmit}>
            <InputGroup size="sm">
                <InputLeftElement
                    pointerEvents="none"
                    children={
                        <RiSearchLine fill="var(--chakra-colors-gray-400)" />
                    }
                />
                <Input
                    placeholder="Search key..."
                    variant="outline"
                    colorScheme="gray"
                    width="320px"
                    borderRadius="6px"
                    borderColor="gray.200"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </InputGroup>
        </form>
    );
};

export default SearchBar;
