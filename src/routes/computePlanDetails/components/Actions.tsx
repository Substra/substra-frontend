import { Box, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { RiStarLine, RiStarFill } from 'react-icons/ri';

import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import HyperparametersModal from '@/components/HyperparametersModal';
import PerfDownloadButton from '@/components/PerfDownloadButton';

interface ActionsProps {
    computePlan: ComputePlanT | null;
    loading: boolean;
}
const Actions = ({ computePlan, loading }: ActionsProps): JSX.Element => {
    const { isFavorite, onFavoriteChange } = useFavoriteComputePlans();

    const favorite = !loading && computePlan && isFavorite(computePlan.key);
    const ariaLabel = favorite ? 'Remove from favorites' : 'Add to favorites';
    return (
        <HStack paddingX="8">
            {HYPERPARAMETERS.length && (
                <HyperparametersModal
                    computePlans={computePlan ? [computePlan] : []}
                />
            )}
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
                        computePlan
                            ? onFavoriteChange(computePlan.key)
                            : undefined
                    }
                />
            </Tooltip>
            <Box>
                <PerfDownloadButton />
            </Box>
        </HStack>
    );
};
export default Actions;
