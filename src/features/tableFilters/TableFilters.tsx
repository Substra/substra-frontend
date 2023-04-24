import React, { useContext, useEffect, useRef } from 'react';

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
    Box,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import { TableFiltersContext } from '@/features/tableFilters/useTableFilters';
import { getUrlSearchParams } from '@/hooks/useLocationWithParams';

type TableFiltersProps = {
    children: React.ReactNode | React.ReactNode[];
};
const TableFilters = ({ children }: TableFiltersProps): JSX.Element => {
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

    type TabObjectT = {
        title: string;
        field: string;
    };

    const tabs: TabObjectT[] = React.Children.toArray(children).map((child) => {
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
        let params: string[] = [];
        if (field.endsWith('_date')) {
            params = [`${field}_after`, `${field}_before`];
        } else if (field.startsWith('duration')) {
            params = [`${field}_min`, `${field}_max`];
        } else {
            params = [field];
        }

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
                            colorScheme="primary"
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
                                            backgroundColor: 'primary.50',
                                            color: 'primary.500',
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
                                                backgroundColor="primary.500"
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
                                colorScheme="primary"
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

export default TableFilters;
