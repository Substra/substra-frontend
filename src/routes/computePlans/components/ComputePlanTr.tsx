import CheckboxTd from './CheckboxTd';
import PinBox from './PinBox';
import StatusCell from './StatusCell';
import { Td, Checkbox, Text, HStack, Icon } from '@chakra-ui/react';
import { RiTimeLine } from 'react-icons/ri';
import { useLocation } from 'wouter';

import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';

import { getDiffDates, shortFormatDate } from '@/libs/utils';

import { compilePath, PATHS } from '@/routes';

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
    const [, setLocation] = useLocation();

    return (
        <ClickableTr
            key={computePlan.key}
            onClick={() =>
                setLocation(
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
            <Td minWidth="250px">
                <Text fontSize="xs">{computePlan.tag}</Text>
            </Td>
            <Td minWidth="255px">
                <StatusCell computePlan={computePlan} />
            </Td>
            <Td>
                <Text fontSize="xs">
                    {shortFormatDate(computePlan.creation_date)}
                </Text>
            </Td>
            <Td minWidth="255px">
                <HStack>
                    <Text
                        fontSize="xs"
                        color={!computePlan.start_date ? 'gray.500' : ''}
                    >
                        {!computePlan.start_date && 'Not started yet'}
                        {computePlan.start_date &&
                            `${shortFormatDate(computePlan.start_date)} ->`}
                    </Text>
                    <Text
                        fontSize="xs"
                        color={
                            !computePlan.start_date || !computePlan.end_date
                                ? 'gray.500'
                                : ''
                        }
                    >
                        {computePlan.start_date &&
                            !computePlan.end_date &&
                            'Not ended yet'}
                        {computePlan.start_date &&
                            computePlan.end_date &&
                            shortFormatDate(computePlan.end_date)}
                    </Text>
                </HStack>
                {computePlan.start_date && (
                    <HStack>
                        <Icon as={RiTimeLine} fill="gray.500" />
                        <Text
                            fontSize="xs"
                            color="gray.500"
                            alignItems="center"
                        >
                            {getDiffDates(
                                computePlan.start_date,
                                computePlan.end_date || 'now'
                            )}
                        </Text>
                        {computePlan.status === ComputePlanStatus.doing &&
                            computePlan.estimated_end_date && (
                                <>
                                    <Text fontSize="xs" color="gray.500">
                                        •
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        alignItems="center"
                                    >
                                        {`${getDiffDates(
                                            'now',
                                            computePlan.estimated_end_date
                                        )} remaining`}
                                    </Text>
                                </>
                            )}
                    </HStack>
                )}
            </Td>
        </ClickableTr>
    );
};

export default ComputePlanTr;
