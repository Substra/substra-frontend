import CheckboxTd from './CheckboxTd';
import { ComputePlanProgressSkeleton } from './ComputePlanTrSkeleton';
import PinBox from './PinBox';
import StatusCell from './StatusCell';
import { Td, Checkbox, Text } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import { getMelloddyName } from '@/modules/computePlans/ComputePlanUtils';
import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { shortFormatDate } from '@/libs/utils';

import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

import Duration from '@/components/Duration';
import { ClickableTr } from '@/components/Table';
import Timing from '@/components/Timing';

interface ComputePlanTrProps {
    computePlan: ComputePlanT;
    computePlanDetails: ComputePlanT | undefined;
    computePlanDetailsLoading: boolean | undefined;
    selectedKeys: string[];
    onSelectionChange: (computePlan: ComputePlanT) => () => void;
    pinnedKeys: string[];
    onPinChange: (computePlan: ComputePlanT) => () => void;
    highlighted: boolean;
}

declare const MELLODDY: boolean;

const ComputePlanTr = ({
    computePlan,
    computePlanDetails,
    computePlanDetailsLoading,
    selectedKeys,
    onSelectionChange,
    pinnedKeys,
    onPinChange,
    highlighted,
}: ComputePlanTrProps): JSX.Element => {
    const [, setLocation] = useLocation();

    return (
        <ClickableTr
            key={computePlan.key}
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
                <PinBox
                    isChecked={pinnedKeys.includes(computePlan.key)}
                    onChange={onPinChange(
                        MELLODDY && computePlanDetails
                            ? computePlanDetails
                            : computePlan
                    )}
                />
            </CheckboxTd>
            <Td minWidth="250px">
                <Text fontSize="xs">
                    {MELLODDY ? getMelloddyName(computePlan) : computePlan.tag}
                </Text>
            </Td>
            <Td minWidth="255px">
                {MELLODDY &&
                computePlan.status === ComputePlanStatus.unknown &&
                (computePlanDetailsLoading || !computePlanDetails) ? (
                    <ComputePlanProgressSkeleton />
                ) : (
                    <StatusCell
                        computePlan={
                            MELLODDY && computePlanDetails
                                ? computePlanDetails
                                : computePlan
                        }
                    />
                )}
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
        </ClickableTr>
    );
};

export default ComputePlanTr;
