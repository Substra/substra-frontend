import { Text } from '@chakra-ui/react';

import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';
import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import { shortFormatDate } from '@/libs/utils';

interface TimingProps {
    asset: ComputePlanT | AnyTupleT;
}

const Timing = ({ asset }: TimingProps): JSX.Element => {
    if (!asset.start_date) {
        return (
            <Text color="gray.500">
                {[
                    ComputePlanStatus.todo,
                    ComputePlanStatus.waiting,
                    TupleStatus.todo,
                    TupleStatus.waiting,
                ].includes(asset.status)
                    ? 'Not started yet'
                    : 'Information not available'}
            </Text>
        );
    }

    return (
        <Text>
            <Text as="span">{`${shortFormatDate(asset.start_date)} ->`}</Text>
            {asset.end_date && (
                <Text as="span">{shortFormatDate(asset.end_date)}</Text>
            )}
            {!asset.end_date && (
                <Text color="gray.500" as="span">
                    {[
                        ComputePlanStatus.done,
                        ComputePlanStatus.canceled,
                        ComputePlanStatus.failed,
                        TupleStatus.done,
                        TupleStatus.canceled,
                        TupleStatus.failed,
                    ].includes(asset.status)
                        ? 'Information not available'
                        : 'Not ended yet'}
                </Text>
            )}
        </Text>
    );
};
export default Timing;
