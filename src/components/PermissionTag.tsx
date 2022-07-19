import { Tag, TagLabel, TagRightIcon, Wrap, WrapItem } from '@chakra-ui/react';
import {
    RiGlobalLine,
    RiGroupLine,
    RiLockLine,
    RiUserLine,
} from 'react-icons/ri';

import { PermissionT } from '@/modules/common/CommonTypes';

type PermissionTagProps = {
    permission: PermissionT;
    listOrganizations?: boolean;
};
const PermissionTag = ({
    permission,
    listOrganizations,
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

    if (listOrganizations) {
        return (
            <Wrap spacing="2.5" justify="flex-start">
                {permission.authorized_ids.map((nodeId) => (
                    <WrapItem key={nodeId}>
                        <Tag size="sm" key={nodeId}>
                            <TagLabel>{nodeId}</TagLabel>
                            <TagRightIcon as={RiUserLine} />
                        </Tag>
                    </WrapItem>
                ))}
            </Wrap>
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
