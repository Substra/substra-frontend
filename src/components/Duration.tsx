import { HStack, Icon, Text } from '@chakra-ui/react';
import { RiTimeLine } from 'react-icons/ri';

import {
    ComputePlanStatus,
    ComputePlanT,
    isComputePlan,
} from '@/modules/computePlans/ComputePlansTypes';
import { AnyTupleT } from '@/modules/tasks/TuplesTypes';

import { getDiffDates } from '@/libs/utils';

interface DurationProps {
    asset: ComputePlanT | AnyTupleT;
}

const Duration = ({ asset }: DurationProps): JSX.Element | null => {
    if (!asset.start_date) {
        return null;
    }

    return (
        <HStack color="gray.500" display="inline-flex">
            <Icon as={RiTimeLine} />
            <Text>
                {getDiffDates(asset.start_date, asset.end_date || 'now')}
            </Text>
            {isComputePlan(asset) &&
                asset.status === ComputePlanStatus.doing &&
                asset.estimated_end_date && (
                    <>
                        <Text>•</Text>
                        <Text>
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
