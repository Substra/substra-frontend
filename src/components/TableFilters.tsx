import React, { useContext, useEffect, useRef, useState } from 'react';

import {
    Button,
    ButtonGroup,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Box,
    Checkbox,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import { TableFiltersContext, useTableFilter } from '@/hooks/useTableFilters';
import { areSearchFiltersListsEqual } from '@/libs/searchFilter';
import { getStatusDescription, getStatusLabel } from '@/libs/status';
import { areSetEqual } from '@/libs/utils';
import { AlgoCategory } from '@/modules/algos/AlgosTypes';
import { CATEGORY_LABEL } from '@/modules/algos/AlgosUtils';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import TableFilterCheckboxes from '@/components/TableFilterCheckboxes';

interface TableFiltersProps {
    children: React.ReactNode | React.ReactNode[];
}
export const TableFilters = ({ children }: TableFiltersProps): JSX.Element => {
    const {
        clearAll,
        applyAll,
        resetAll,
        onPopoverClose,
        onPopoverOpen,
        isPopoverOpen,
        tabIndex,
        setTabIndex,
    } = useContext(TableFiltersContext);

    const initialFocusRef = useRef(null);

    useEffect(() => {
        resetAll();
    }, [isPopoverOpen]);

    const tabTitles: string[] = React.Children.toArray(children).map(
        (child) => {
            const firstChild = React.Children.toArray(child)[0];
            // @ts-expect-error This is a custom property that is not part of any type, so it cannot be checked properly by TypeScript
            const title = firstChild?.type?.filterTitle;
            return title || 'Could not extract title from component';
        }
    );

    const onClear = () => {
        clearAll();
        onPopoverClose();
    };

    const onApply = () => {
        applyAll();
        onPopoverClose();
    };

    return (
        <Box>
            <Popover
                initialFocusRef={initialFocusRef}
                placement="bottom-start"
                isOpen={isPopoverOpen}
                onClose={onPopoverClose}
                onOpen={onPopoverOpen}
            >
                <PopoverTrigger>
                    <Button
                        size="sm"
                        backgroundColor="secondary"
                        leftIcon={<RiAddLine />}
                    >
                        Add Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent minWidth="670px" boxShadow="xl">
                    <PopoverArrow />
                    <PopoverCloseButton onClick={onPopoverClose} />
                    <PopoverBody padding="0" overflow="hidden">
                        <Tabs
                            variant="soft-rounded"
                            colorScheme="teal"
                            orientation="vertical"
                            isLazy={false}
                            index={tabIndex}
                            onChange={(index: number) => setTabIndex(index)}
                        >
                            <TabList
                                padding="2.5"
                                boxShadow="xl"
                                minWidth="160px"
                            >
                                {tabTitles.map((title, index) => (
                                    <Tab
                                        _selected={{
                                            backgroundColor: 'teal.50',
                                            color: 'teal.500',
                                        }}
                                        fontSize="sm"
                                        justifyContent="flex-start"
                                        key={title}
                                        ref={
                                            index === tabIndex
                                                ? initialFocusRef
                                                : null
                                        }
                                    >
                                        {title}
                                    </Tab>
                                ))}
                            </TabList>
                            <TabPanels padding="0">
                                {React.Children.toArray(children).map(
                                    (child, index) => (
                                        <TabPanel
                                            padding="0"
                                            key={tabTitles[index]}
                                        >
                                            {child}
                                        </TabPanel>
                                    )
                                )}
                            </TabPanels>
                        </Tabs>
                    </PopoverBody>
                    <PopoverFooter
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        padding="2.5"
                    >
                        <ButtonGroup size="sm">
                            <Button
                                bg="white"
                                variant="outline"
                                onClick={onClear}
                            >
                                Clear
                            </Button>
                            <Button
                                color="white"
                                colorScheme="teal"
                                onClick={onApply}
                            >
                                Apply
                            </Button>
                        </ButtonGroup>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export const OwnerTableFilter = (): JSX.Element => {
    const { checkboxesValue, onOptionChange } = useTableFilter('owner');

    const nodes = useAppSelector((state) => state.nodes.nodes);

    return (
        <TableFilterCheckboxes
            options={nodes.map((node) => node.id)}
            value={checkboxesValue}
            onChange={onOptionChange}
        />
    );
};

OwnerTableFilter.filterTitle = 'Owner';

export const WorkerTableFilter = (): JSX.Element => {
    const { checkboxesValue, onOptionChange } = useTableFilter('worker');

    const nodes = useAppSelector((state) => state.nodes.nodes);

    return (
        <TableFilterCheckboxes
            options={nodes.map((node) => node.id)}
            value={checkboxesValue}
            onChange={onOptionChange}
        />
    );
};

WorkerTableFilter.filterTitle = 'Worker';

export const TaskStatusTableFilter = (): JSX.Element => {
    const { checkboxesValue, onOptionChange } = useTableFilter('status');

    const options = Object.values(TupleStatus).map((status) => ({
        value: status,
        label: getStatusLabel(status),
        description: getStatusDescription(status),
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={checkboxesValue}
            onChange={onOptionChange}
        />
    );
};

TaskStatusTableFilter.filterTitle = 'Status';

export const ComputePlanStatusTableFilter = (): JSX.Element => {
    const { checkboxesValue, onOptionChange } = useTableFilter('status');

    const options = Object.values(ComputePlanStatus).map((status) => ({
        value: status,
        label: getStatusLabel(status),
        description: getStatusDescription(status),
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={checkboxesValue}
            onChange={onOptionChange}
        />
    );
};

ComputePlanStatusTableFilter.filterTitle = 'Status';

export const ComputePlanFavoritesTableFilter = ({
    favorites,
}: {
    favorites: string[];
}): JSX.Element => {
    const {
        checkboxesValue,
        resetCheckboxesValue,
        setCheckboxesValue,
        setValue,
    } = useTableFilter('key');

    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const isFavoritesOnly = () =>
        favorites.length > 0 &&
        areSetEqual(new Set(checkboxesValue), new Set(favorites));

    const [favoritesOnly, setFavoritesOnly] = useState(isFavoritesOnly);

    useEffect(() => {
        setFavoritesOnly(isFavoritesOnly());
    }, [checkboxesValue]);

    useEffect(() => {
        if (favoritesOnly) {
            const newSearchFilters = setValue(searchFilters, favorites);
            if (!areSearchFiltersListsEqual(searchFilters, newSearchFilters)) {
                setCheckboxesValue(favorites);
                setLocationWithParams({ search: newSearchFilters, page: 1 });
            }
        }
    }, [favorites]);

    useSearchFiltersEffect(() => {
        const cpKeyFilters = searchFilters
            .filter((sf) => sf.asset === 'compute_plan' && sf.key === 'key')
            .map((sf) => sf.value);

        if (cpKeyFilters.length === 0 && checkboxesValue.length > 0) {
            resetCheckboxesValue();
        }
    }, [searchFilters]);

    const onChange = () => {
        if (favoritesOnly) {
            resetCheckboxesValue();
        } else {
            setCheckboxesValue(favorites);
        }
        setFavoritesOnly(!favoritesOnly);
    };

    return (
        <Box w="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <Checkbox
                isChecked={favoritesOnly}
                isDisabled={!favorites.length}
                onChange={onChange}
                colorScheme="teal"
                alignItems="start"
            >
                <Text fontSize="sm" lineHeight="1.2">
                    Favorites Only
                </Text>
            </Checkbox>
            {!favorites.length && (
                <Text color="gray.500" fontSize="xs">
                    You currently have no favorite compute plan
                </Text>
            )}
        </Box>
    );
};

ComputePlanFavoritesTableFilter.filterTitle = 'Favorites';

export const AlgoCategoryTableFilter = (): JSX.Element => {
    const { checkboxesValue, onOptionChange } = useTableFilter('category');

    const options = Object.values(AlgoCategory).map((category) => ({
        value: category,
        label: CATEGORY_LABEL[category],
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={checkboxesValue}
            onChange={onOptionChange}
        />
    );
};

AlgoCategoryTableFilter.filterTitle = 'Category';
