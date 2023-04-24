import useAuthStore from '@/features/auth/useAuthStore';
import { PermissionT } from '@/types/CommonTypes';

const useHasPermission = (): ((permission: PermissionT) => boolean) => {
    const {
        info: { organization_id: currentNodeID },
    } = useAuthStore();

    return (permission: PermissionT): boolean =>
        permission.public || permission.authorized_ids.includes(currentNodeID);
};
export default useHasPermission;
