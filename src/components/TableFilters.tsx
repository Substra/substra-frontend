import React, { useEffect, useRef } from 'react';

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
    useDisclosure,
    Box,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import { AlgoCategory } from '@/modules/algos/AlgosTypes';
import { CATEGORY_LABEL } from '@/modules/algos/AlgosUtils';
import { AssetType } from '@/modules/common/CommonTypes';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { getNodeLabel } from '@/modules/nodes/NodesUtils';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import { getStatusDescription, getStatusLabel } from '@/libs/status';

import { useAppSelector } from '@/hooks';
import {
    TableFiltersContext,
    useTableFilter,
    useTableFilters,
} from '@/hooks/useTableFilters';

import TableFilterCheckboxes from '@/components/TableFilterCheckboxes';

interface TableFiltersProps {
    asset: AssetType;
    children: React.ReactNode | React.ReactNode[];
}
export const TableFilters = ({
    asset,
    children,
}: TableFiltersProps): JSX.Element => {
    const { context, clearAll, applyAll, resetAll } = useTableFilters(asset);
    const { onOpen, onClose, isOpen } = useDisclosure();

    const initialFocusRef = useRef(null);

    useEffect(() => {
        resetAll();
    }, [isOpen]);

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
        onClose();
    };

    const onApply = () => {
        applyAll();
        onClose();
    };

    return (
        <Box>
            <Popover
                initialFocusRef={initialFocusRef}
                placement="bottom-start"
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
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
                    <PopoverCloseButton onClick={onClose} />
                    <PopoverBody padding="0" overflow="hidden">
                        <TableFiltersContext.Provider value={context}>
                            <Tabs
                                variant="soft-rounded"
                                colorScheme="teal"
                                orientation="vertical"
                                isLazy={false}
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
                                                index === 0
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
                        </TableFiltersContext.Provider>
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
            options={nodes.map((node) => ({
                value: node.id,
                label: getNodeLabel(node.id),
            }))}
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
            options={nodes.map((node) => ({
                value: node.id,
                label: getNodeLabel(node.id),
            }))}
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
