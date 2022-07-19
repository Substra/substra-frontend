import {
    Box,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    Tooltip,
} from '@chakra-ui/react';
import { RiStarLine, RiStarFill, RiMoreLine } from 'react-icons/ri';

import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import useCancelComputePlan from '@/routes/computePlanDetails/hooks/useCancelComputePlan';

import PerfDownloadButton from '@/components/PerfDownloadButton';

type ActionsProps = {
    computePlan: ComputePlanT | null;
    loading: boolean;
    metadataModal?: React.ReactNode;
};
const Actions = ({
    computePlan,
    loading,
    metadataModal,
}: ActionsProps): JSX.Element => {
    const { isFavorite, onFavoriteChange } = useFavoriteComputePlans();

    const favorite = !loading && computePlan && isFavorite(computePlan.key);
    const ariaLabel = favorite ? 'Remove from favorites' : 'Add to favorites';

    const { cancelComputePlanDialog, cancelComputePlanMenuItem } =
        useCancelComputePlan(computePlan);

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
                        computePlan
                            ? onFavoriteChange(computePlan.key)
                            : undefined
                    }
                />
            </Tooltip>
            {metadataModal}
            <Box>
                <PerfDownloadButton />
            </Box>
            {cancelComputePlanDialog && cancelComputePlanMenuItem && (
                <Box>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<RiMoreLine />}
                            variant="outline"
                            size="xs"
                        />
                        <MenuList>{cancelComputePlanMenuItem}</MenuList>
                    </Menu>
                    {cancelComputePlanDialog}
                </Box>
            )}
        </HStack>
    );
};
export default Actions;
