import React from 'react';

import { PermissionType } from '@/modules/common/CommonTypes';

type PermissionCellContentProps = {
    permission: PermissionType;
};

const PermissionCellContent = ({
    permission,
}: PermissionCellContentProps): JSX.Element => {
    if (permission.public) {
        return <span>Processable by anyone</span>;
    }

    if (permission.authorized_ids.length === 1) {
        return <span>Processable by its owner only</span>;
    }

    return <span>Restricted</span>;
};

export default PermissionCellContent;
