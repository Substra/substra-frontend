import { Thead, Tr, Th } from '@chakra-ui/react';

import {
    ColumnT,
    GeneralColumnName,
} from '@/features/customColumns/CustomColumnsTypes';
import { getColumnId } from '@/features/customColumns/CustomColumnsUtils';

import OrderingTh from '@/components/table/OrderingTh';
import {
    bottomBorderProps,
    bottomRightBorderProps,
} from '@/components/table/Table';

type ColumnThProps = {
    column: ColumnT;
    onPopoverOpen: (tabIndex?: number) => void;
};
const ColumnTh = ({ column, onPopoverOpen }: ColumnThProps): JSX.Element => {
    if (column.type === 'metadata') {
        return (
            <OrderingTh
                minWidth="125px"
                openFilters={() => onPopoverOpen(5)}
                options={[
                    {
                        label: column.name,
                        asc: {
                            label: `Sort ${column} Z -> A`,
                            value: `-metadata__${column}`,
                        },
                        desc: {
                            label: `Sort ${column} A -> Z`,
                            value: `metadata__${column}`,
                        },
                    },
                ]}
                {...bottomBorderProps}
            />
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.status
    ) {
        return (
            <OrderingTh
                minWidth="255px"
                openFilters={() => onPopoverOpen(0)}
                options={[
                    {
                        label: 'Status',
                        desc: {
                            label: 'Sort status A -> Z',
                            value: 'status',
                        },
                        asc: {
                            label: 'Sort status Z -> A',
                            value: '-status',
                        },
                    },
                    {
                        label: 'Tasks',
                    },
                ]}
                {...bottomBorderProps}
            />
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.creation
    ) {
        return (
            <OrderingTh
                minWidth="255px"
                openFilters={() => onPopoverOpen(2)}
                options={[
                    {
                        label: 'Creation',
                        asc: {
                            label: 'Sort creation oldest first',
                            value: 'creation_date',
                        },
                        desc: {
                            label: 'Sort creation newest first',
                            value: '-creation_date',
                        },
                    },
                ]}
                {...bottomBorderProps}
            />
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.dates
    ) {
        return (
            <OrderingTh
                minWidth="300px"
                whiteSpace="nowrap"
                openFilters={() => onPopoverOpen(3)}
                options={[
                    {
                        label: 'Start date',
                        asc: {
                            label: 'Sort start date oldest first',
                            value: 'start_date',
                        },
                        desc: {
                            label: 'Sort start date newest first',
                            value: '-start_date',
                        },
                    },
                    {
                        label: 'End date',
                        asc: {
                            label: 'Sort end date oldest first',
                            value: 'end_date',
                        },
                        desc: {
                            label: 'Sort end date newest first',
                            value: '-end_date',
                        },
                    },
                    {
                        label: 'Duration',
                        asc: {
                            label: 'Sort duration longest first',
                            value: '-duration',
                        },
                        desc: {
                            label: 'Sort duration shortest first',
                            value: 'duration',
                        },
                    },
                ]}
            />
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.creator
    ) {
        return (
            <OrderingTh
                minWidth="125px"
                //TODO: use the right number value
                openFilters={() => onPopoverOpen(1)}
                options={[
                    {
                        label: 'Creator',
                        asc: {
                            label: `Sort creator Z -> A`,
                            value: `-creator`,
                        },
                        desc: {
                            label: `Sort creator A -> Z`,
                            value: `creator`,
                        },
                    },
                ]}
                {...bottomBorderProps}
            />
        );
    } else {
        return <Th>{`Unknown column ${column.name}`}</Th>;
    }
};

type ComputePlanTHeadProps = {
    onPopoverOpen: (tabIndex?: number) => void;
    columns: ColumnT[];
};
const ComputePlanTHead = ({
    onPopoverOpen,
    columns,
}: ComputePlanTHeadProps) => {
    return (
        <Thead position="sticky" top={0} backgroundColor="white" zIndex="2">
            <Tr>
                <Th
                    padding="0"
                    minWidth="50px"
                    position="sticky"
                    left="0"
                    zIndex="1"
                    backgroundColor="white"
                    {...bottomBorderProps}
                ></Th>
                <Th
                    padding="0"
                    minWidth="36px"
                    position="sticky"
                    left="50px"
                    zIndex="1"
                    backgroundColor="white"
                    {...bottomBorderProps}
                ></Th>
                <OrderingTh
                    minWidth="250px"
                    options={[
                        {
                            label: 'Name',
                            asc: {
                                label: 'Sort name Z -> A',
                                value: '-name',
                            },
                            desc: {
                                label: 'Sort name A -> Z',
                                value: 'name',
                            },
                        },
                    ]}
                    position="sticky"
                    left="86px"
                    zIndex="1"
                    backgroundColor="white"
                    {...bottomRightBorderProps}
                />
                {columns.map((column) => (
                    <ColumnTh
                        key={getColumnId(column)}
                        column={column}
                        onPopoverOpen={onPopoverOpen}
                    />
                ))}
            </Tr>
        </Thead>
    );
};
export default ComputePlanTHead;
