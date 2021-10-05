/** @jsxRuntime classic */

/** @jsx jsx */
import { useState } from 'react';

import { Flex } from '@chakra-ui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { RiSearchLine } from 'react-icons/ri';

import { AssetType } from '@/modules/common/CommonTypes';

import { SearchFilterType } from '@/libs/searchFilter';

import { useSearchFiltersEffect } from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import CloseButton from '@/components/CloseButton';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const SearchForm = styled.form`
    width: 530px;
    height: ${Spaces.extraLarge};
    border: 1px solid ${Colors.border};
    border-radius: 16px;
    background-color: white;
    display: flex;
    overflow: hidden;
`;

const InputContainer = styled.div`
    flex-grow: 1;
    align-self: stretch;
    position: relative;
    border-left: 1px solid ${Colors.border};
`;

const searchIcon = css`
    position: absolute;
    top: ${Spaces.small};
    left: ${Spaces.small};
    z-index: 1;
    width: 16px;
    height: 16px;
    color: ${Colors.lightContent};
    pointer-events: none;
`;

const Input = styled.input`
    line-height: 30px;
    padding-left: ${Spaces.extraLarge};
    padding-right: ${Spaces.medium};
    width: 100%;
    color: ${Colors.lightContent};
    font-size: ${Fonts.sizes.input};
`;

const clearButton = css`
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;

    & > svg {
        width: 16px;
        height: 16px;
    }
`;

interface SearchBarProps {
    asset: AssetType;
    label: string;
}
const SearchBar = ({ asset, label }: SearchBarProps): JSX.Element => {
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

    const onClear = () => {
        setValue('');
        setLocationWithParams({
            search: searchFilters.filter((sf) => sf.key !== 'key'),
            page: 1,
        });
    };

    return (
        <SearchForm onSubmit={onSubmit}>
            <Flex
                width="180px"
                align="center"
                paddingLeft="4"
                pointerEvents="none"
                color={Colors.lightContent}
                fontSize={Fonts.sizes.input}
            >
                {label}
            </Flex>
            <InputContainer>
                <RiSearchLine css={searchIcon} aria-hidden={true} />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search by key"
                />
                <CloseButton
                    type="button"
                    onClick={onClear}
                    disabled={!value}
                    css={clearButton}
                />
            </InputContainer>
        </SearchForm>
    );
};

export default SearchBar;
