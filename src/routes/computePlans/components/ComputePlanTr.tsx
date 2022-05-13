import { useLocation } from 'wouter';

import { Box, Td, Checkbox, Text, Tooltip } from '@chakra-ui/react';

import { shortFormatDate } from '@/libs/utils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

import Duration from '@/components/Duration';
import { ClickableTr, rightBorderProps } from '@/components/Table';
import Timing from '@/components/Timing';

import CheckboxTd from './CheckboxTd';
import FavoriteBox from './FavoriteBox';
import StatusCell from './StatusCell';

interface ComputePlanTrProps {
    computePlan: ComputePlanT;
    isSelected: boolean;
    onSelectionChange: () => void;
    isFavorite: boolean;
    onFavoriteChange: () => void;
    customColumns: string[];
}

const ComputePlanTr = ({
    computePlan,
    isSelected,
    onSelectionChange,
    isFavorite,
    onFavoriteChange,
    customColumns,
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
                    colorScheme="teal"
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
            <Td minWidth="255px">
                <StatusCell computePlan={computePlan} />
            </Td>
            <Td>
                <Text fontSize="xs">
                    {shortFormatDate(computePlan.creation_date)}
                </Text>
            </Td>
            <Td minWidth="255px" fontSize="xs">
                <Timing asset={computePlan} />
                <Duration asset={computePlan} />
            </Td>
            {customColumns.map((column) => (
                <Td
                    key={`${computePlan.key}-${column}`}
                    fontSize="xs"
                    whiteSpace="nowrap"
                >
                    <Text>{computePlan.metadata[column] ?? '-'}</Text>
                </Td>
            ))}
        </ClickableTr>
    );
};

export default ComputePlanTr;
