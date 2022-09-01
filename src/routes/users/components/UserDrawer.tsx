import { useEffect } from 'react';

import { Drawer, useDisclosure, DrawerOverlay } from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import { PATHS } from '@/paths';

import CreateUserForm from './CreateUserForm';
import UpdateUserForm from './UpdateUserForm';

const UserDrawer = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const key = useKeyFromPath(PATHS.USER);

    const editMode = key !== 'create';

    useEffect(() => {
        if (key && !isOpen) {
            onOpen();
        }
    }, [dispatch, isOpen, onOpen, editMode, key]);

    const closeHandler = () => {
        setLocationPreserveParams(PATHS.USERS);
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={closeHandler}
            size="md"
            autoFocus={false}
        >
            <DrawerOverlay />
            {!editMode && isOpen && (
                <CreateUserForm closeHandler={closeHandler} />
            )}
            {editMode && isOpen && (
                <UpdateUserForm closeHandler={closeHandler} />
            )}
        </Drawer>
    );
};

export default UserDrawer;
