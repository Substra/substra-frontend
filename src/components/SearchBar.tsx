/** @jsxRuntime classic */

/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { RiSearchLine } from 'react-icons/ri';

import { AssetType } from '@/modules/common/CommonTypes';

import { SearchFilterType } from '@/libs/searchFilter';

import { useSearchFiltersLocation, useSearchFiltersEffect } from '@/hooks';

import CloseButton from '@/components/CloseButton';
import Select from '@/components/Select';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const selectWidth = css`
    width: 180px;
`;

const SearchForm = styled.form`
    width: 530px;
    height: ${Spaces.extraLarge};
    border: 1px solid ${Colors.border};
    border-radius: 16px;
    background-color: white;
    display: flex;
    overflow: hidden;

    // The position should be part of the parent component but since the SearchBar is always used
    // in the same way it makes sense to mutualize the position here.
    position: absolute;
    right: 0;
    top: ${Spaces.large};
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
    assetOptions: {
        value: AssetType;
        label: string;
    }[];
}
const SearchBar = ({ assetOptions }: SearchBarProps): JSX.Element => {
    const defaultAsset = assetOptions.length > 0 ? assetOptions[0].value : '';
    const [value, setValue] = useState('');
    const [asset, setAsset] = useState(defaultAsset);

    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    useSearchFiltersEffect(() => {
        // filters that can be created with this search bar:
        // - only on key
        // - only for assets that can be selected
        const keySearchFilters = searchFilters.filter(
            (sf) =>
                sf.key === 'key' &&
                assetOptions.find((option) => option.value === sf.asset)
        );
        if (keySearchFilters.length) {
            const keySearchFilter = keySearchFilters[0];
            setAsset(keySearchFilter.asset);
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
        setSearchFiltersLocation(newSearchFilters);
    };

    const onAssetChange = (asset: string) => {
        setAsset(asset);
        applySearchFilters(asset);
    };

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        applySearchFilters(asset);
    };

    const onClear = () => {
        setValue('');
        setSearchFiltersLocation(
            searchFilters.filter((sf) => sf.key !== 'key')
        );
    };

    return (
        <SearchForm onSubmit={onSubmit}>
            <Select
                css={selectWidth}
                options={assetOptions}
                value={asset}
                onChange={onAssetChange}
            />
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