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
import useSelection from '@/hooks/useSelection';
import {
    useSyncedDateStringState,
    useStatus,
    useCategory,
    useSyncedStringArrayState,
    useFavoritesOnly,
} from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFilterCallbackRefs,
} from '@/hooks/useTableFilters';
import { getStatusDescription, getStatusLabel } from '@/libs/status';
import { AlgoCategory } from '@/modules/algos/AlgosTypes';
import { CATEGORY_LABEL } from '@/modules/algos/AlgosUtils';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import TableFilterCheckboxes from '@/components/TableFilterCheckboxes';
import TableFilterDate from '@/components/TableFilterDate';

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
    }, [isPopoverOpen, resetAll]);

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

const buildNodeTableFilter = (
    field: string,
    title: string,
    subtitle?: string
) => {
    const NodeTableFilter = (): JSX.Element => {
        const [tmpNodes, onTmpNodeChange, resetTmpNodes, setTmpNodes] =
            useSelection();
        const [activeNodes] = useSyncedStringArrayState(field, []);
        const { clearRef, applyRef, resetRef } =
            useTableFilterCallbackRefs(field);

        clearRef.current = (urlSearchParams) => {
            resetTmpNodes();
            urlSearchParams.delete(field);
        };

        applyRef.current = (urlSearchParams) => {
            if (tmpNodes.length > 0) {
                urlSearchParams.set(field, tmpNodes.join(','));
            } else {
                urlSearchParams.delete(field);
            }
        };

        resetRef.current = () => {
            setTmpNodes(activeNodes);
        };

        const nodes = useAppSelector((state) => state.nodes.nodes);

        return (
            <TableFilterCheckboxes
                title={subtitle}
                options={nodes.map((node) => node.id)}
                value={tmpNodes}
                onChange={onTmpNodeChange}
            />
        );
    };

    NodeTableFilter.filterTitle = title;
    return NodeTableFilter;
};

export const OwnerTableFilter = buildNodeTableFilter('owner', 'Owner');
export const WorkerTableFilter = buildNodeTableFilter('worker', 'Worker');
export const PermissionsTableFilter = buildNodeTableFilter(
    'can_process',
    'Permissions',
    'Organizations which can process the assets'
);
export const LogsAccessTableFilter = buildNodeTableFilter(
    'can_access_logs',
    'Logs access',
    'Organizations which can see the logs of a failed task using the dataset'
);

export const TaskStatusTableFilter = (): JSX.Element => {
    const [tmpStatus, onTmpStatusChange, resetTmpStatus, setTmpStatus] =
        useSelection();

    const [activeStatus] = useStatus();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('status');

    clearRef.current = (urlSearchParams) => {
        resetTmpStatus();
        urlSearchParams.delete('status');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpStatus.length > 0) {
            urlSearchParams.set('status', tmpStatus.join(','));
        } else {
            urlSearchParams.delete('status');
        }
    };

    resetRef.current = () => {
        setTmpStatus(activeStatus);
    };

    const options = Object.values(TupleStatus).map((status) => ({
        value: status,
        label: getStatusLabel(status),
        description: getStatusDescription(status),
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={tmpStatus}
            onChange={onTmpStatusChange}
        />
    );
};

TaskStatusTableFilter.filterTitle = 'Status';

export const ComputePlanStatusTableFilter = (): JSX.Element => {
    const [tmpStatus, onTmpStatusChange, resetTmpStatus, setTmpStatus] =
        useSelection();

    const [activeStatus] = useStatus();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('status');

    clearRef.current = (urlSearchParams) => {
        resetTmpStatus();
        urlSearchParams.delete('status');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpStatus.length > 0) {
            urlSearchParams.set('status', tmpStatus.join(','));
        } else {
            urlSearchParams.delete('status');
        }
    };

    resetRef.current = () => {
        setTmpStatus(activeStatus);
    };

    const options = Object.values(ComputePlanStatus).map((status) => ({
        value: status,
        label: getStatusLabel(status),
        description: getStatusDescription(status),
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={tmpStatus}
            onChange={onTmpStatusChange}
        />
    );
};

ComputePlanStatusTableFilter.filterTitle = 'Status';

export const ComputePlanFavoritesTableFilter = ({
    favorites,
}: {
    favorites: string[];
}): JSX.Element => {
    const [tmpFavoritesOnly, setTmpFavoritesOnly] = useState(false);

    const [activeFavoritesOnly] = useFavoritesOnly();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('favorites');

    clearRef.current = (urlSearchParams) => {
        urlSearchParams.delete('favorites_only');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpFavoritesOnly) {
            urlSearchParams.set('favorites_only', '1');
        } else {
            urlSearchParams.delete('favorites_only');
        }
    };

    resetRef.current = () => {
        setTmpFavoritesOnly(activeFavoritesOnly);
    };

    const onChange = () => {
        setTmpFavoritesOnly(!tmpFavoritesOnly);
    };

    return (
        <Box w="100%" paddingY="5" paddingX="30px">
            <Text color="gray.500" fontSize="xs" mb="2.5">
                Filter by
            </Text>
            <Checkbox
                isChecked={tmpFavoritesOnly}
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
    const [
        tmpCategories,
        onTmpCategoryChange,
        resetTmpCategories,
        setTmpCategories,
    ] = useSelection();
    const [activeCategories] = useCategory();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('category');

    clearRef.current = (urlSearchParams) => {
        resetTmpCategories();
        urlSearchParams.delete('category');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpCategories.length > 0) {
            urlSearchParams.set('category', tmpCategories.join(','));
        } else {
            urlSearchParams.delete('category');
        }
    };

    resetRef.current = () => {
        setTmpCategories(activeCategories);
    };

    const options = Object.values(AlgoCategory).map((category) => ({
        value: category,
        label: CATEGORY_LABEL[category],
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={tmpCategories}
            onChange={onTmpCategoryChange}
        />
    );
};

AlgoCategoryTableFilter.filterTitle = 'Category';

const buildDateTableFilter = (field: string, title: string) => {
    const DateTableFilter = (): JSX.Element => {
        const [tmpMinDate, setTmpMinDate] = useState<string>('');
        const [tmpMaxDate, setTmpMaxDate] = useState<string>('');

        const [activeMinDate] = useSyncedDateStringState(`${field}_after`, '');
        const [activeMaxDate] = useSyncedDateStringState(`${field}_before`, '');

        const { clearRef, applyRef, resetRef } =
            useTableFilterCallbackRefs(field);

        clearRef.current = (urlSearchParams) => {
            setTmpMinDate('');
            setTmpMaxDate('');
            urlSearchParams.delete(`${field}_after`);
            urlSearchParams.delete(`${field}_before`);
        };

        applyRef.current = (urlSearchParams) => {
            if (tmpMinDate) {
                urlSearchParams.set(`${field}_after`, tmpMinDate);
            } else {
                urlSearchParams.delete(`${field}_after`);
            }
            if (tmpMaxDate) {
                urlSearchParams.set(`${field}_before`, tmpMaxDate);
            } else {
                urlSearchParams.delete(`${field}_before`);
            }
        };

        resetRef.current = () => {
            setTmpMinDate(activeMinDate);
            setTmpMaxDate(activeMaxDate);
        };

        return (
            <TableFilterDate
                minDate={tmpMinDate}
                setMinDate={setTmpMinDate}
                maxDate={tmpMaxDate}
                setMaxDate={setTmpMaxDate}
            />
        );
    };
    DateTableFilter.filterTitle = title;
    return DateTableFilter;
};

export const CreationDateTableFilter = buildDateTableFilter(
    'creation_date',
    'Creation date'
);

export const StartDateTableFilter = buildDateTableFilter(
    'start_date',
    'Start date'
);

export const EndDateTableFilter = buildDateTableFilter('end_date', 'End date');
