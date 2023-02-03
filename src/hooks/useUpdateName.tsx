import { useCallback, useMemo } from 'react';

import { AsyncThunk } from '@reduxjs/toolkit';

import { useDisclosure } from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/useToast';
import { FunctionT } from '@/modules/functions/FunctionsTypes';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { DatasetT } from '@/modules/datasets/DatasetsTypes';

import UpdateNameButton from '@/components/UpdateNameButton';
import UpdateNameDialog from '@/components/UpdateNameDialog';
import UpdateNameMenuItem from '@/components/UpdateNameMenuItem';

type UpdateNameAssetAsyncThunkT<T> = AsyncThunk<
    T,
    {
        key: string;
        name: string;
    },
    { rejectValue: string }
>;

type UseUpdateNameProps = {
    dialogTitle: string;
    assetKey: string;
    assetName: string;
    assetUpdating: boolean;
    updateSlice:
        | UpdateNameAssetAsyncThunkT<FunctionT>
        | UpdateNameAssetAsyncThunkT<DatasetT>
        | UpdateNameAssetAsyncThunkT<ComputePlanT>;
};
const useUpdateName = ({
    assetKey,
    assetName,
    assetUpdating,
    dialogTitle,
    updateSlice,
}: UseUpdateNameProps): {
    updateNameDialog: React.ReactNode;
    updateNameButton: React.ReactNode;
    updateNameMenuItem: React.ReactNode;
} => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useAppDispatch();
    const toast = useToast();

    const updateName = useCallback(
        (newName: string) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: I couldn't figure out the type issue with updateSlice
            dispatch(updateSlice({ key: assetKey, name: newName })).then(
                ({ type, payload }) => {
                    if (type === updateSlice.rejected.type) {
                        toast({
                            title: "Couldn't update name",
                            status: 'error',
                            isClosable: true,
                            descriptionComponent: payload as string,
                        });
                    }
                    if (type === updateSlice.fulfilled.type) {
                        toast({
                            title: 'Name updated',
                            status: 'success',
                            isClosable: true,
                        });
                    }
                    onClose();
                }
            );
        },
        [assetKey, dispatch, toast, updateSlice, onClose]
    );

    const updateNameDialog = useMemo(
        () => (
            <UpdateNameDialog
                title={dialogTitle}
                isOpen={isOpen}
                onClose={onClose}
                updateName={updateName}
                updating={assetUpdating}
                name={assetName}
            />
        ),
        [assetName, assetUpdating, dialogTitle, isOpen, onClose, updateName]
    );

    const updateNameButton = useMemo(
        () => (
            <UpdateNameButton
                title={dialogTitle}
                assetUpdating={assetUpdating}
                openUpdateNameDialog={onOpen}
            />
        ),
        [assetUpdating, dialogTitle, onOpen]
    );

    const updateNameMenuItem = useMemo(
        () => (
            <UpdateNameMenuItem
                title={dialogTitle}
                openUpdateNameDialog={onOpen}
            />
        ),
        [dialogTitle, onOpen]
    );

    return {
        updateNameDialog,
        updateNameButton,
        updateNameMenuItem,
    };
};

export default useUpdateName;
