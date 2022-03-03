import { ComputePlanStub, ComputePlanT } from './ComputePlansTypes';

import { TupleStatus } from '@/modules/tasks/TuplesTypes';

export const getStatusCount = (
    computePlan: ComputePlanT,
    status: TupleStatus
): number => {
    if (status === TupleStatus.doing) {
        return computePlan.doing_count;
    } else if (status === TupleStatus.done) {
        return computePlan.done_count;
    } else if (status === TupleStatus.canceled) {
        return computePlan.canceled_count;
    } else if (status === TupleStatus.failed) {
        return computePlan.failed_count;
    } else if (status === TupleStatus.todo) {
        return computePlan.todo_count;
    } else if (status === TupleStatus.waiting) {
        return computePlan.waiting_count;
    }

    throw `Invalid status ${status}`;
};

declare const MELLODDY: boolean;

export const getMelloddyName = (
    computePlan: ComputePlanT | ComputePlanStub
): string => {
    if (MELLODDY) {
        const name = computePlan.metadata['name'] || 'Unnamed compute plan';
        return name;
    }

    throw 'Cannot get MELLODDY name if MELLODDY flag is not set';
};

export const compareComputePlans = (
    a: ComputePlanT,
    b: ComputePlanT
): -1 | 0 | 1 => {
    if (a.key < b.key) {
        return -1;
    } else if (a.key === b.key) {
        return 0;
    } else {
        return 1;
    }
};
