import { HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { RiStarLine, RiStarFill } from 'react-icons/ri';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';

interface ActionsProps {
    computePlan: ComputePlanT | null;
    loading: boolean;
}
const Actions = ({ computePlan, loading }: ActionsProps): JSX.Element => {
    const { isFavorite, onFavoriteChange } = useFavoriteComputePlans();

    const favorite = !loading && computePlan && isFavorite(computePlan);
    const ariaLabel = favorite ? 'Remove from favorites' : 'Add to favorites';
    return (
        <HStack paddingX="8">
            <Tooltip
                label={ariaLabel}
                fontSize="xs"
                hasArrow={true}
                placement="top-end"
                closeOnClick={false}
            >
                <IconButton
                    size="xs"
                    aria-label={ariaLabel}
                    icon={favorite ? <RiStarFill /> : <RiStarLine />}
                    color={favorite ? 'teal' : 'gray'}
                    isDisabled={loading || !computePlan}
                    onClick={
                        computePlan ? onFavoriteChange(computePlan) : undefined
                    }
                />
            </Tooltip>
        </HStack>
    );
};
export default Actions;
