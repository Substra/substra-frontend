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

import useAppSelector from '@/hooks/useAppSelector';
import useFavoriteComputePlans from '@/hooks/useFavoriteComputePlans';
import useUpdateName from '@/hooks/useUpdateName';
import { updateComputePlan } from '@/modules/computePlans/ComputePlansSlice';
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
    const { updateNameDialog, updateNameMenuItem } = useUpdateName({
        dialogTitle: 'Rename compute plan',
        assetKey: computePlan?.key ?? '',
        assetName: computePlan?.name ?? '',
        assetUpdating: useAppSelector(
            (state) => state.computePlans.computePlanUpdating
        ),
        updateSlice: updateComputePlan,
    });

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
                    <MenuList>
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
