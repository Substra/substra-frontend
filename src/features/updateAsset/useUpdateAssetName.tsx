import { useCallback, useMemo } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import UpdateNameButton from '@/features/updateAsset/UpdateNameButton';
import UpdateNameDialog from '@/features/updateAsset/UpdateNameDialog';
import UpdateNameMenuItem from '@/features/updateAsset/UpdateNameMenuItem';
import { useToast } from '@/hooks/useToast';
import { ComputePlanT } from '@/types/ComputePlansTypes';
import { DatasetT } from '@/types/DatasetTypes';
import { FunctionT } from '@/types/FunctionsTypes';

type UpdateAssetArgsT = {
    dialogTitle: string;
    asset: DatasetT | ComputePlanT | FunctionT | null;
    updatingAsset: boolean;
    updateAsset: (key: string, name: string) => Promise<unknown>;
};

const useUpdateAssetName = ({
    dialogTitle,
    asset,
    updateAsset,
    updatingAsset,
}: UpdateAssetArgsT): {
    updateNameDialog: React.ReactNode;
    updateNameButton: React.ReactNode;
    updateNameMenuItem: React.ReactNode;
} => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const updateName = useCallback(
        async (newName: string) => {
            if (!asset) {
                return;
            }
            const error = await updateAsset(asset.key, newName);
            if (error) {
                toast({
                    title: "Couldn't update name",
                    status: 'error',
                    isClosable: true,
                    descriptionComponent: error as string,
                });
            } else {
                toast({
                    title: 'Name updated',
                    status: 'success',
                    isClosable: true,
                });
                onClose();
            }
        },
        [asset, onClose, toast, updateAsset]
    );

    const updateNameDialog = useMemo(
        () => (
            <UpdateNameDialog
                title={dialogTitle}
                isOpen={isOpen}
                onClose={onClose}
                updateName={updateName}
                updating={updatingAsset}
                name={asset?.name ?? ''}
            />
        ),
        [asset?.name, isOpen, onClose, updateName, updatingAsset, dialogTitle]
    );

    const updateNameButton = useMemo(
        () => (
            <UpdateNameButton
                title={dialogTitle}
                updating={updatingAsset}
                openUpdateNameDialog={onOpen}
            />
        ),
        [updatingAsset, dialogTitle, onOpen]
    );

    const updateNameMenuItem = useMemo(
        () => (
            <UpdateNameMenuItem
                title={dialogTitle}
                openUpdateNameDialog={onOpen}
            />
        ),
        [onOpen, dialogTitle]
    );

    return {
        updateNameDialog,
        updateNameButton,
        updateNameMenuItem,
    };
};

export default useUpdateAssetName;
