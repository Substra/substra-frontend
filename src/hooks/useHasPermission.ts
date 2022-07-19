import useAppSelector from '@/hooks/useAppSelector';
import { PermissionT } from '@/modules/common/CommonTypes';

const useHasPermission = (): ((permission: PermissionT) => boolean) => {
    const currentNodeID = useAppSelector(
        (state) => state.me.info.organization_id
    );

    return (permission: PermissionT): boolean =>
        permission.public || permission.authorized_ids.includes(currentNodeID);
};
export default useHasPermission;
