import React, { useContext, useEffect, useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

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
    Select,
    Input,
    IconButton,
    Flex,
    VStack,
} from '@chakra-ui/react';
import { RiAddLine, RiDeleteBin7Line } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import { getUrlSearchParams } from '@/hooks/useLocationWithParams';
import useSelection from '@/hooks/useSelection';
import {
    useSyncedDateStringState,
    useStatus,
    useSyncedStringArrayState,
    useFavoritesOnly,
    metadataToString,
    useMetadataWithUUID,
} from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFilterCallbackRefs,
} from '@/hooks/useTableFilters';
import { getStatusDescription, getStatusLabel } from '@/libs/status';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import {
    MetadataFilterType,
    MetadataFilterWithUUID,
} from '@/modules/metadata/MetadataTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import TableFilterCheckboxes from '@/components/TableFilterCheckboxes';
import TableFilterDate, {
    TableFilterDateProps,
} from '@/components/TableFilterDate';

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

    interface TabObject {
        title: string;
        field: string;
    }

    const tabs: TabObject[] = React.Children.toArray(children).map((child) => {
        const firstChild = React.Children.toArray(child)[0];

        // @ts-expect-error This is a custom property that is not part of any type, so it cannot be checked properly by TypeScript
        const title = firstChild?.type?.filterTitle;
        // @ts-expect-error This is a custom property that is not part of any type, so it cannot be checked properly by TypeScript
        const field = firstChild?.type?.filterField;

        if (!title || !field) {
            throw 'Could not extract title or field from component';
        }

        return { title, field };
    });

    const isActive = (field: string) => {
        const params = field.endsWith('_date')
            ? [`${field}_after`, `${field}_before`]
            : [field];
        const urlSearchParams = getUrlSearchParams();

        for (const param of params) {
            if (urlSearchParams.get(param)) {
                return true;
            }
        }
        return false;
    };

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
                <PopoverContent minWidth="690px" boxShadow="xl">
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
                                {tabs.map((tab, index) => (
                                    <Tab
                                        _selected={{
                                            backgroundColor: 'teal.50',
                                            color: 'teal.500',
                                        }}
                                        fontSize="sm"
                                        justifyContent="flex-start"
                                        key={tab.title}
                                        ref={
                                            index === tabIndex
                                                ? initialFocusRef
                                                : null
                                        }
                                    >
                                        {tab.title}
                                        {isActive(tab.field) && (
                                            <Box
                                                height="6px"
                                                width="6px"
                                                marginLeft="3px"
                                                marginTop="-6px"
                                                backgroundColor="teal.500"
                                                borderRadius="50%"
                                            />
                                        )}
                                    </Tab>
                                ))}
                            </TabList>
                            <TabPanels padding="0">
                                {React.Children.toArray(children).map(
                                    (child, index) => (
                                        <TabPanel
                                            padding="0"
                                            key={tabs[index].title}
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

const buildOrganizationTableFilter = (
    field: string,
    title: string,
    subtitle?: string
) => {
    const OrganizationTableFilter = (): JSX.Element => {
        const [
            tmpOrganizations,
            onTmpOrganizationChange,
            resetTmpOrganizations,
            setTmpOrganizations,
        ] = useSelection();
        const [activeOrganizations] = useSyncedStringArrayState(field, []);
        const { clearRef, applyRef, resetRef } =
            useTableFilterCallbackRefs(field);

        clearRef.current = (urlSearchParams) => {
            resetTmpOrganizations();
            urlSearchParams.delete(field);
        };

        applyRef.current = (urlSearchParams) => {
            if (tmpOrganizations.length > 0) {
                urlSearchParams.set(field, tmpOrganizations.join(','));
            } else {
                urlSearchParams.delete(field);
            }
        };

        resetRef.current = () => {
            setTmpOrganizations(activeOrganizations);
        };

        const organizations = useAppSelector(
            (state) => state.organizations.organizations
        );

        return (
            <TableFilterCheckboxes
                title={subtitle}
                options={organizations.map((organization) => organization.id)}
                value={tmpOrganizations}
                onChange={onTmpOrganizationChange}
            />
        );
    };

    OrganizationTableFilter.filterTitle = title;
    OrganizationTableFilter.filterField = field;
    return OrganizationTableFilter;
};

export const OwnerTableFilter = buildOrganizationTableFilter('owner', 'Owner');
export const WorkerTableFilter = buildOrganizationTableFilter(
    'worker',
    'Worker'
);
export const PermissionsTableFilter = buildOrganizationTableFilter(
    'can_process',
    'Permissions',
    'Organizations which can process the assets'
);
export const LogsAccessTableFilter = buildOrganizationTableFilter(
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
TaskStatusTableFilter.filterField = 'status';

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
ComputePlanStatusTableFilter.filterField = 'status';

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
ComputePlanFavoritesTableFilter.filterField = 'favorites_only';

const defaultFilterDateMode: TableFilterDateProps['mode'] = 'after';

const buildDateTableFilter = (field: string, title: string) => {
    const DateTableFilter = (): JSX.Element => {
        const [tmpMinDate, setTmpMinDate] = useState<string>('');
        const [tmpMaxDate, setTmpMaxDate] = useState<string>('');
        const [tmpMode, setTmpMode] = useState<TableFilterDateProps['mode']>(
            defaultFilterDateMode
        );

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
            if (
                tmpMinDate &&
                tmpMode &&
                ['after', 'between'].includes(tmpMode)
            ) {
                urlSearchParams.set(`${field}_after`, tmpMinDate);
            } else {
                urlSearchParams.delete(`${field}_after`);
            }
            if (
                tmpMaxDate &&
                tmpMode &&
                ['before', 'between'].includes(tmpMode)
            ) {
                urlSearchParams.set(`${field}_before`, tmpMaxDate);
            } else {
                urlSearchParams.delete(`${field}_before`);
            }
        };

        resetRef.current = () => {
            setTmpMinDate(activeMinDate);
            setTmpMaxDate(activeMaxDate);
        };

        useEffect(() => {
            setTmpMinDate(activeMinDate);
            setTmpMaxDate(activeMaxDate);

            setTmpMode(() => {
                if (activeMinDate && activeMaxDate) {
                    return 'between';
                } else if (activeMinDate) {
                    return 'after';
                } else if (activeMaxDate) {
                    return 'before';
                }
                return defaultFilterDateMode;
            });
        }, [activeMinDate, activeMaxDate]);

        return (
            <TableFilterDate
                minDate={tmpMinDate}
                setMinDate={setTmpMinDate}
                maxDate={tmpMaxDate}
                setMaxDate={setTmpMaxDate}
                mode={tmpMode}
                setMode={setTmpMode}
            />
        );
    };
    DateTableFilter.filterTitle = title;
    DateTableFilter.filterField = field;
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

const MetadataFilterForm = ({
    value,
    onChange,
    onRemove,
}: {
    value: MetadataFilterWithUUID;
    onChange: (filter: MetadataFilterWithUUID) => void;
    onRemove: () => void;
}) => {
    const availableKeys = useAppSelector((state) => state.metadata.metadata);
    const [filterKey, setFilterKey] = useState<string>(value.key);
    const [filterType, setFilterType] = useState<MetadataFilterType>(
        value.type
    );
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
        const newFilterType = e.target.value as MetadataFilterType;
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

export const MetadataTableFilter = (): JSX.Element => {
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('metadata');
    const [tmpFilters, setTmpFilters] = useState<MetadataFilterWithUUID[]>([]);
    const [activeFilters] = useMetadataWithUUID();

    const metadata = useAppSelector((state) => state.metadata.metadata);

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
