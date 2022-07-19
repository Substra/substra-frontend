import useAppSelector from '@/hooks/useAppSelector';
import useHasPermission from '@/hooks/useHasPermission';
import { PermissionsT } from '@/modules/common/CommonTypes';

const useCanDownloadModel = (): ((permissions: PermissionsT) => boolean) => {
    const modelExportEnabled = useAppSelector(
        (state) => !!state.me.info.config.model_export_enabled
    );
    const hasPermission = useHasPermission();

    return (permissions: PermissionsT): boolean =>
        modelExportEnabled && hasPermission(permissions.download);
};
export default useCanDownloadModel;
