import { HStack, Icon, Text } from '@chakra-ui/react';
import { RiTimeLine } from 'react-icons/ri';

import { formatDuration, getDiffDates } from '@/libs/utils';
import {
    ComputePlanStatus,
    ComputePlanT,
    isComputePlan,
} from '@/modules/computePlans/ComputePlansTypes';
import { AnyTupleT } from '@/modules/tasks/TuplesTypes';

interface DurationProps {
    asset: ComputePlanT | AnyTupleT;
}

const Duration = ({ asset }: DurationProps): JSX.Element | null => {
    if (!asset.start_date) {
        return null;
    }

    return (
        <HStack color="gray.500" display="inline-flex" flexWrap="wrap">
            <Icon as={RiTimeLine} />
            <Text whiteSpace="nowrap">{formatDuration(asset.duration)}</Text>
            {isComputePlan(asset) &&
                asset.status === ComputePlanStatus.doing &&
                asset.estimated_end_date && (
                    <>
                        <Text>•</Text>
                        <Text whiteSpace="nowrap">
                            {`${getDiffDates(
                                'now',
                                asset.estimated_end_date
                            )} remaining`}
                        </Text>
                    </>
                )}
        </HStack>
    );
};
export default Duration;
