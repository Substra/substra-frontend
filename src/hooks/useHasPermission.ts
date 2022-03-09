import useAppSelector from '@/hooks/useAppSelector';
import { PermissionType } from '@/modules/common/CommonTypes';

const useHasPermission = (): ((permission: PermissionType) => boolean) => {
    const currentNodeID = useAppSelector((state) => state.nodes.info.node_id);

    return (permission: PermissionType): boolean =>
        permission.public || permission.authorized_ids.includes(currentNodeID);
};
export default useHasPermission;
