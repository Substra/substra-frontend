import Icon from '@chakra-ui/icon';
import { Box } from '@chakra-ui/react';
import { RiGroupLine } from 'react-icons/ri';

import { PermissionsT } from '@/types/CommonTypes';

import { TaskIOTooltip } from '../TasksUtils';

const TaskIOPermissions = ({
    permissions,
}: {
    permissions?: PermissionsT | null;
}): JSX.Element => {
    let permittedGroup = '';

    if (!permissions || permissions.download.public) {
        permittedGroup = 'everyone';
    } else if (
        !permissions.download?.public &&
        permissions.download?.authorized_ids.length
    ) {
        permittedGroup = permissions?.download.authorized_ids.join();
    } else {
        permittedGroup = 'owner only';
    }

    return (
        <TaskIOTooltip label={`Accessible by ${permittedGroup}`}>
            <Box display="flex" alignItems="center">
                <Icon as={RiGroupLine} color="gray.400" boxSize="14px" />
            </Box>
        </TaskIOTooltip>
    );
};

export default TaskIOPermissions;
