import { useEffect } from 'react';

import { Drawer, useDisclosure, DrawerOverlay } from '@chakra-ui/react';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import { PATHS } from '@/paths';
import { AbortFunctionT } from '@/types/CommonTypes';

import CreateUserForm from './CreateUserForm';
import UpdateUserForm from './UpdateUserForm';

const UserDrawer = ({
    fetchUsersList,
}: {
    fetchUsersList: () => AbortFunctionT;
}): JSX.Element => {
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const username = useKeyFromPath(PATHS.USER);

    useEffect(() => {
        if (!!username && !isOpen) {
            onOpen();
        }
    }, [isOpen, onOpen, username]);

    const closeHandler = () => {
        setLocationPreserveParams(PATHS.USERS);
        onClose();
    };

    const key = useKeyFromPath(PATHS.USER);
    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (key === 'create') {
                setDocumentTitle('User creation');
            } else if (key) {
                setDocumentTitle(`Update ${key}`);
            }
        },
        [key]
    );

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={closeHandler}
            size="md"
            autoFocus={false}
        >
            <DrawerOverlay />
            {username === 'create' && (
                <CreateUserForm
                    closeHandler={closeHandler}
                    fetchUsersList={fetchUsersList}
                />
            )}
            {!!username && username !== 'create' && (
                <UpdateUserForm
                    closeHandler={closeHandler}
                    fetchUsersList={fetchUsersList}
                    username={username || ''}
                />
            )}
        </Drawer>
    );
};

export default UserDrawer;
