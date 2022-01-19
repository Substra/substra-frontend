import { PermissionType } from '@/modules/common/CommonTypes';

import useAppSelector from '@/hooks/useAppSelector';

const useHasPermission = (): ((permission: PermissionType) => boolean) => {
    const currentNodeID = useAppSelector((state) => state.nodes.info.node_id);

    return (permission: PermissionType): boolean =>
        permission.public || permission.authorized_ids.includes(currentNodeID);
};
export default useHasPermission;
