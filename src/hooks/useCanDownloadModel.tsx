import useAuthStore from '@/features/auth/useAuthStore';
import useHasPermission from '@/hooks/useHasPermission';
import { PermissionsT } from '@/types/CommonTypes';

const useCanDownloadModel = (): ((permissions: PermissionsT) => boolean) => {
    const {
        info: {
            config: { model_export_enabled: modelExportEnabled },
        },
    } = useAuthStore();
    const hasPermission = useHasPermission();

    return (permissions: PermissionsT): boolean =>
        !!modelExportEnabled && hasPermission(permissions.download);
};
export default useCanDownloadModel;
