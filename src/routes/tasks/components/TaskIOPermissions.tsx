import { Box, Icon } from '@chakra-ui/react';
import { RiGroupLine } from 'react-icons/ri';

import { PermissionsT } from '@/types/CommonTypes';

import { TaskIOTooltip } from '../TasksUtils';

const TaskIOPermissions = ({
    permissions,
}: {
    permissions?: PermissionsT | null;
}): JSX.Element => {
    let label = '';

    if (!permissions && permissions !== null) {
        label = 'No permissions available yet';
    } else if (permissions === null || permissions?.download.public) {
        label = 'Accessible by everyone';
    } else if (
        !permissions.download?.public &&
        permissions.download?.authorized_ids.length
    ) {
        label = `Accessible by ${permissions?.download.authorized_ids.join()}`;
    } else {
        label = 'Accessible by owner only';
    }

    return (
        <TaskIOTooltip label={label}>
            <Box display="flex" alignItems="center">
                <Icon as={RiGroupLine} color="gray.400" boxSize="14px" />
            </Box>
        </TaskIOTooltip>
    );
};

export default TaskIOPermissions;
