import { useLocation } from 'wouter';

import { Box, Td, Checkbox, Text, Tooltip } from '@chakra-ui/react';

import { shortFormatDate } from '@/libs/utils';
import { getMelloddyName } from '@/modules/computePlans/ComputePlanUtils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

import Duration from '@/components/Duration';
import { ClickableTr } from '@/components/Table';
import Timing from '@/components/Timing';

import CheckboxTd from './CheckboxTd';
import FavoriteBox from './FavoriteBox';
import StatusCell from './StatusCell';

interface ComputePlanTrProps {
    computePlan: ComputePlanT;
    selectedKeys: string[];
    onSelectionChange: (computePlan: ComputePlanT) => () => void;
    isFavorite: (computePlan: ComputePlanT) => boolean;
    onFavoriteChange: (computePlan: ComputePlanT) => () => void;
    highlighted: boolean;
}

const ComputePlanTr = ({
    computePlan,
    selectedKeys,
    onSelectionChange,
    isFavorite,
    onFavoriteChange,
    highlighted,
}: ComputePlanTrProps): JSX.Element => {
    const [, setLocation] = useLocation();

    return (
        <ClickableTr
            backgroundColor={highlighted ? 'gray.50' : 'white'}
            onClick={() =>
                setLocation(
                    compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                        key: computePlan.key,
                        category: TASK_CATEGORY_SLUGS[TaskCategory.test],
                    })
                )
            }
        >
            <CheckboxTd firstCol={true}>
                <Checkbox
                    isChecked={selectedKeys.includes(computePlan.key)}
                    onChange={onSelectionChange(computePlan)}
                    colorScheme="teal"
                />
            </CheckboxTd>
            <CheckboxTd>
                <Tooltip
                    label={
                        isFavorite(computePlan)
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
                            isChecked={isFavorite(computePlan)}
                            onChange={onFavoriteChange(computePlan)}
                        />
                    </Box>
                </Tooltip>
            </CheckboxTd>
            <Td minWidth="250px">
                <Text fontSize="xs">
                    {MELLODDY ? getMelloddyName(computePlan) : computePlan.tag}
                </Text>
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
            {HYPERPARAMETERS.map((hp) => (
                <Td
                    key={`${computePlan.tag}-${hp}`}
                    fontSize="xs"
                    whiteSpace="nowrap"
                    border="none"
                >
                    <Text>{computePlan.metadata[hp] || '-'}</Text>
                </Td>
            ))}
        </ClickableTr>
    );
};

export default ComputePlanTr;
