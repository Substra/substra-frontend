import { useState, useEffect } from 'react';

import { v4 as uuidv4 } from 'uuid';

import {
    Flex,
    Select,
    Input,
    IconButton,
    Box,
    VStack,
    Button,
    Text,
} from '@chakra-ui/react';
import { RiDeleteBin7Line, RiAddLine } from 'react-icons/ri';

import useMetadataStore from '@/features/metadata/useMetadataStore';
import { useMetadataWithUUID, metadataToString } from '@/hooks/useSyncedState';
import { useTableFilterCallbackRefs } from '@/hooks/useTableFilters';
import {
    MetadataFilterWithUuidT,
    MetadataFilterT,
} from '@/types/MetadataTypes';

const MetadataFilterForm = ({
    value,
    onChange,
    onRemove,
}: {
    value: MetadataFilterWithUuidT;
    onChange: (filter: MetadataFilterWithUuidT) => void;
    onRemove: () => void;
}) => {
    const { metadata: availableKeys } = useMetadataStore();
    const [filterKey, setFilterKey] = useState<string>(value.key);
    const [filterType, setFilterType] = useState<MetadataFilterT>(value.type);
    const [filterValue, setFilterValue] = useState<string>(value.value ?? '');
    useEffect(() => {
        setFilterKey(value.key);
        setFilterType(value.type);
        setFilterValue(value.value ?? '');
    }, [value?.type, value?.key, value?.value]);

    const onFilterKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilterKey = e.target.value;
        setFilterKey(newFilterKey);
        onChange({
            uuid: value.uuid,
            key: newFilterKey,
            type: filterType,
            value: filterType === 'exists' ? undefined : filterValue,
        });
    };

    const onFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilterType = e.target.value as MetadataFilterT;
        setFilterType(newFilterType);
        setFilterValue(newFilterType === 'exists' ? '' : filterValue);
        if (value.key) {
            onChange({
                uuid: value.uuid,
                key: filterKey,
                type: newFilterType,
                value: newFilterType === 'exists' ? undefined : filterValue,
            });
        }
    };

    const onFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilterValue = e.target.value;
        setFilterValue(newFilterValue);
        if (value.key) {
            onChange({
                uuid: value.uuid,
                key: filterKey,
                type: filterType,
                value: newFilterValue,
            });
        }
    };

    return (
        <Flex width="100%">
            <Select
                value={filterKey}
                onChange={onFilterKeyChange}
                size="sm"
                width="170px"
                flexShrink="0"
                marginRight="1"
            >
                {availableKeys.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </Select>
            <Select
                value={filterType}
                onChange={onFilterTypeChange}
                size="sm"
                marginRight="1"
                width="105px"
                flexShrink="0"
            >
                <option value="is">is</option>
                <option value="contains">contains</option>
                <option value="exists">exists</option>
            </Select>
            {(filterType === 'is' || filterType === 'contains') && (
                <Input
                    size="sm"
                    placeholder="Metadata value"
                    value={filterValue}
                    onChange={onFilterValueChange}
                    width="0"
                    flexGrow="1"
                    flexShrink="1"
                    marginRight="1"
                />
            )}
            <IconButton
                icon={<RiDeleteBin7Line />}
                onClick={onRemove}
                aria-label="Remove filter"
                size="sm"
                variant="ghost"
                flexShrink="0"
                marginLeft="auto"
            />
        </Flex>
    );
};

const MetadataTableFilter = (): JSX.Element => {
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('metadata');
    const [tmpFilters, setTmpFilters] = useState<MetadataFilterWithUuidT[]>([]);
    const [activeFilters] = useMetadataWithUUID();

    const { metadata } = useMetadataStore();

    clearRef.current = (urlSearchParams) => {
        setTmpFilters([]);
        urlSearchParams.delete('metadata');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpFilters.length > 0) {
            urlSearchParams.set('metadata', metadataToString(tmpFilters));
        } else {
            urlSearchParams.delete('metadata');
        }
    };

    resetRef.current = () => {
        setTmpFilters([...activeFilters]);
    };

    return (
        <Box width="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <VStack spacing="2" alignItems="flex-start">
                {tmpFilters.map((filter) => (
                    <MetadataFilterForm
                        key={filter.uuid}
                        value={filter}
                        onChange={(newTmpFilter) => {
                            setTmpFilters(
                                tmpFilters.map((tmpFilter) =>
                                    newTmpFilter.uuid === tmpFilter.uuid
                                        ? newTmpFilter
                                        : tmpFilter
                                )
                            );
                        }}
                        onRemove={() => {
                            setTmpFilters(
                                tmpFilters.filter(
                                    (tmpFilter) =>
                                        tmpFilter.uuid !== filter.uuid
                                )
                            );
                        }}
                    />
                ))}
                <Button
                    isDisabled={!metadata.length}
                    leftIcon={<RiAddLine />}
                    size="sm"
                    onClick={() =>
                        setTmpFilters([
                            ...tmpFilters,
                            {
                                uuid: uuidv4(),
                                key: metadata.length > 0 ? metadata[0] : '',
                                type: 'is',
                                value: '',
                            },
                        ])
                    }
                >
                    Add rule
                </Button>
            </VStack>
        </Box>
    );
};

MetadataTableFilter.filterTitle = 'Metadata';
MetadataTableFilter.filterField = 'metadata';

export default MetadataTableFilter;
