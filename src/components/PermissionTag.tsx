import { HStack, Tag, TagLabel, TagRightIcon } from '@chakra-ui/react';
import {
    RiGlobalLine,
    RiGroupLine,
    RiLockLine,
    RiUserLine,
} from 'react-icons/ri';

import { PermissionType } from '@/modules/common/CommonTypes';

interface PermissionTagProps {
    permission: PermissionType;
    listNodes?: boolean;
}
const PermissionTag = ({
    permission,
    listNodes,
}: PermissionTagProps): JSX.Element => {
    if (permission.public) {
        return (
            <Tag size="sm">
                <TagLabel>Everybody</TagLabel>
                <TagRightIcon as={RiGlobalLine} />
            </Tag>
        );
    }
    if (permission.authorized_ids.length === 1) {
        return (
            <Tag size="sm">
                <TagLabel>Owner only</TagLabel>
                <TagRightIcon as={RiLockLine} />
            </Tag>
        );
    }

    if (listNodes) {
        return (
            <HStack spacing="2.5" display="inline-flex">
                {permission.authorized_ids.map((nodeId) => (
                    <Tag size="sm" key={nodeId}>
                        <TagLabel>{nodeId}</TagLabel>
                        <TagRightIcon as={RiUserLine} />
                    </Tag>
                ))}
            </HStack>
        );
    } else {
        return (
            <Tag size="sm">
                <TagLabel>Restricted</TagLabel>
                <TagRightIcon as={RiGroupLine} />
            </Tag>
        );
    }
};
export default PermissionTag;
