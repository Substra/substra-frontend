import { useLocation } from 'wouter';

import { Box, Td, Checkbox, Text, Tooltip } from '@chakra-ui/react';

import { ColumnT } from '@/features/customColumns/CustomColumnsTypes';
import {
    GeneralColumnName,
    getColumnId,
} from '@/features/customColumns/CustomColumnsUtils';
import { shortFormatDate } from '@/libs/utils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { TaskCategory, TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

import Duration from '@/components/Duration';
import { ClickableTr, rightBorderProps } from '@/components/Table';
import Timing from '@/components/Timing';

import CheckboxTd from './CheckboxTd';
import FavoriteBox from './FavoriteBox';
import StatusCell from './StatusCell';

type ColumnTdProps = {
    column: ColumnT;
    computePlan: ComputePlanT;
};

const ColumnTd = ({ column, computePlan }: ColumnTdProps) => {
    if (column.type === 'metadata') {
        return (
            <Td fontSize="xs" whiteSpace="nowrap">
                <Text>{computePlan.metadata[column.name] ?? '-'}</Text>
            </Td>
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.status
    ) {
        return (
            <Td minWidth="255px">
                <StatusCell computePlan={computePlan} />
            </Td>
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.creation
    ) {
        return (
            <Td>
                <Text fontSize="xs">
                    {shortFormatDate(computePlan.creation_date)}
                </Text>
            </Td>
        );
    } else if (
        column.type === 'general' &&
        column.name === GeneralColumnName.dates
    ) {
        return (
            <Td minWidth="255px" fontSize="xs">
                <Timing asset={computePlan} />
                <Duration asset={computePlan} />
            </Td>
        );
    } else {
        return (
            <Td>
                <Text fontSize="xs">{`Unknown column ${column.name}`}</Text>
            </Td>
        );
    }
};

type ComputePlanTrProps = {
    computePlan: ComputePlanT;
    isSelected: boolean;
    onSelectionChange: () => void;
    isFavorite: boolean;
    onFavoriteChange: () => void;
    columns: ColumnT[];
};

const ComputePlanTr = ({
    computePlan,
    isSelected,
    onSelectionChange,
    isFavorite,
    onFavoriteChange,
    columns,
}: ComputePlanTrProps): JSX.Element => {
    const [, setLocation] = useLocation();

    return (
        <ClickableTr
            backgroundColor="white"
            onClick={() =>
                setLocation(
                    compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                        key: computePlan.key,
                        category: TASK_CATEGORY_SLUGS[TaskCategory.test],
                    })
                )
            }
        >
            <CheckboxTd
                firstCol={true}
                position="sticky"
                left="0"
                zIndex="1"
                backgroundColor="white"
            >
                <Checkbox
                    isChecked={isSelected}
                    onChange={onSelectionChange}
                    colorScheme="primary"
                />
            </CheckboxTd>
            <CheckboxTd
                position="sticky"
                left="50px"
                zIndex="1"
                backgroundColor="white"
            >
                <Tooltip
                    label={
                        isFavorite
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                    }
                    fontSize="xs"
                    hasArrow={true}
                    placement="top"
                    closeOnClick={false}
                >
                    <Box as="span">
                        <FavoriteBox
                            isChecked={isFavorite}
                            onChange={onFavoriteChange}
                        />
                    </Box>
                </Tooltip>
            </CheckboxTd>
            <Td
                minWidth="250px"
                position="sticky"
                left="86px"
                zIndex="1"
                backgroundColor="white"
                {...rightBorderProps}
            >
                <Text fontSize="xs">{computePlan.name}</Text>
            </Td>
            {columns.map((column) => (
                <ColumnTd
                    key={getColumnId(column)}
                    column={column}
                    computePlan={computePlan}
                />
            ))}
        </ClickableTr>
    );
};

export default ComputePlanTr;
