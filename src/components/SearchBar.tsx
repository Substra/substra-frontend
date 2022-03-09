import { useState } from 'react';

import {
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    CloseButton,
} from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';

import { useSearchFiltersEffect } from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import { SearchFilterType } from '@/libs/searchFilter';
import { AssetType } from '@/modules/common/CommonTypes';

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
        } else {
            setValue('');
        }
    }, [searchFilters]);

    const applySearchFilters = (value: string) => {
        // preserve all filters that are not on asset key
        const newSearchFilters: SearchFilterType[] = searchFilters.filter(
            (sf) => sf.key !== 'key'
        );
        if (value) {
            newSearchFilters.push({
                asset,
                key: 'key',
                value,
            });
        }
        setLocationWithParams({ search: newSearchFilters, page: 1 });
    };

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        applySearchFilters(value);
    };

    const onClear = () => {
        applySearchFilters('');
    };

    const onBlur = () => {
        applySearchFilters(value);
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
                    width="360px"
                    borderColor="gray.200"
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => setValue(e.target.value)}
                    focusBorderColor="teal.500"
                />
                <InputRightElement>
                    {value && <CloseButton size="sm" onClick={onClear} />}
                </InputRightElement>
            </InputGroup>
        </form>
    );
};

export default SearchBar;
