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

import useUpdateAssetName from '@/features/updateAsset/useUpdateAssetName';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import useCancelComputePlan from '@/routes/computePlanDetails/hooks/useCancelComputePlan';
import { ComputePlanT } from '@/types/ComputePlansTypes';

import PerfDownloadButton from '@/components/PerfDownloadButton';

import useComputePlanStore from '../useComputePlanStore';

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
    const { updatingComputePlan, updateComputePlan } = useComputePlanStore();
    const { updateNameDialog, updateNameMenuItem } = useUpdateAssetName({
        dialogTitle: 'Rename compute plan',
        asset: computePlan ?? null,
        updatingAsset: updatingComputePlan,
        updateAsset: updateComputePlan,
    });

    return (
        <HStack paddingX="8" data-cpkey={computePlan?.key}>
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
                    icon={
                        favorite ? (
                            <RiStarFill data-cy="favorite-cp" />
                        ) : (
                            <RiStarLine />
                        )
                    }
                    data-cy="favorite-box"
                    color={favorite ? 'primary' : 'gray'}
                    isDisabled={loading || !computePlan}
                    variant="outline"
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
            <Box>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<RiMoreLine />}
                        variant="outline"
                        size="xs"
                    />
                    <MenuList zIndex="10">
                        {updateNameMenuItem}
                        {cancelComputePlanMenuItem}
                    </MenuList>
                </Menu>
                {updateNameDialog}
                {cancelComputePlanDialog}
            </Box>
        </HStack>
    );
};
export default Actions;
