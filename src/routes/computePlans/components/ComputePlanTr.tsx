import CheckboxTd from './CheckboxTd';
import PinBox from './PinBox';
import { Td, Checkbox, Flex, Text } from '@chakra-ui/react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import { formatDate } from '@/libs/utils';

import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import ComputeProgressBar from '@/components/ComputeProgressBar';
import Status from '@/components/Status';
import { ClickableTr } from '@/components/Table';

interface ComputePlanTrProps {
    computePlan: ComputePlanT;
    selectedKeys: string[];
    onSelectionChange: (
        key: string
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    pinnedKeys: string[];
    onPinChange: (computePlan: ComputePlanT) => () => void;
}

const ComputePlanTr = ({
    computePlan,
    selectedKeys,
    onSelectionChange,
    pinnedKeys,
    onPinChange,
}: ComputePlanTrProps): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
    return (
        <ClickableTr
            key={computePlan.key}
            onClick={() =>
                setLocationWithParams(
                    compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                        key: computePlan.key,
                    })
                )
            }
        >
            <CheckboxTd firstCol={true}>
                <Checkbox
                    value={computePlan.key}
                    checked={selectedKeys.includes(computePlan.key)}
                    onChange={onSelectionChange(computePlan.key)}
                    colorScheme="teal"
                />
            </CheckboxTd>
            <CheckboxTd>
                <PinBox
                    checked={pinnedKeys.includes(computePlan.key)}
                    onChange={onPinChange(computePlan)}
                />
            </CheckboxTd>
            <Td maxWidth="350px">
                <Text fontSize="xs">{computePlan.tag}</Text>
            </Td>
            <Td minWidth="255px">
                <Flex alignItems="center" justifyContent="space-between">
                    <Status status={computePlan.status} size="sm" />
                    <Text fontSize="xs" color="gray.600">
                        {computePlan.done_count}/{computePlan.task_count}
                    </Text>
                </Flex>
                <ComputeProgressBar computePlan={computePlan} />
            </Td>
            <Td>
                <Text fontSize="xs">
                    {formatDate(computePlan.creation_date)}
                </Text>
            </Td>
        </ClickableTr>
    );
};

export default ComputePlanTr;
