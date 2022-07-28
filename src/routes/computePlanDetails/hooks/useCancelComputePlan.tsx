import { useCallback, useMemo, useState } from 'react';

import { Text, useDisclosure } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import { useToast } from '@/hooks/useToast';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';
import CancelComputePlanDialog from '@/routes/computePlanDetails/components/CancelComputePlanDialog';
import CancelComputePlanMenuItem from '@/routes/computePlanDetails/components/CancelComputePlanMenuItem';

const useCancelComputePlan = (
    computePlan: ComputePlanT | null
): {
    cancelComputePlanMenuItem: React.ReactNode;
    cancelComputePlanDialog: React.ReactNode;
} => {
    const { onOpen, isOpen, onClose } = useDisclosure();
    const [canceling, setCanceling] = useState(false);
    const currentOrganizationId = useAppSelector(
        (state) => state.me.info.organization_id
    );
    const toast = useToast();

    const isCancellable = useMemo(
        (): boolean =>
            computePlan !== null &&
            computePlan.owner === currentOrganizationId &&
            [
                ComputePlanStatus.doing,
                ComputePlanStatus.todo,
                ComputePlanStatus.waiting,
            ].includes(computePlan.status),
        [currentOrganizationId, computePlan]
    );

    const cancelComputePlan = useCallback(async () => {
        if (computePlan === null) {
            return;
        }

        setCanceling(true);

        try {
            await ComputePlansApi.cancelComputePlan(computePlan.key, {});
        } catch {
            setCanceling(false);
            toast({
                title: 'Could not cancel compute plan!',
                descriptionComponent: () => (
                    <Text>
                        An unknown error occurred when trying to cancel this
                        compute plan.
                    </Text>
                ),
                status: 'error',
                isClosable: true,
            });

            return;
        }

        onClose();
        toast({
            title: 'Compute plan execution canceled!',
            descriptionComponent: () => (
                <>
                    <Text marginBottom="1">
                        Your cancellation request has been registered.
                    </Text>
                    <Text>
                        The compute plan's status will be updated shortly,
                        please refresh this page in a few seconds
                    </Text>
                </>
            ),
            status: 'success',
            isClosable: true,
        });
        setCanceling(false);
    }, [onClose, toast, computePlan]);

    const cancelComputePlanMenuItem = useMemo(
        () =>
            isCancellable ? (
                <CancelComputePlanMenuItem onClick={onOpen} />
            ) : null,
        [isCancellable, onOpen]
    );

    const cancelComputePlanDialog = useMemo(
        () =>
            isCancellable ? (
                <CancelComputePlanDialog
                    isOpen={isOpen}
                    onClose={onClose}
                    cancelComputePlan={cancelComputePlan}
                    canceling={canceling}
                />
            ) : null,
        [cancelComputePlan, canceling, isCancellable, isOpen, onClose]
    );

    return {
        cancelComputePlanMenuItem,
        cancelComputePlanDialog,
    };
};

export default useCancelComputePlan;
