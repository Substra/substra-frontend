import { useAppSelector } from '@/hooks';
import useHasPermission from '@/hooks/useHasPermission';
import { PermissionsType } from '@/modules/common/CommonTypes';

const useCanDownloadModel = (): ((permissions: PermissionsType) => boolean) => {
    const modelExportEnabled = useAppSelector(
        (state) => !!state.nodes.info.config.model_export_enabled
    );
    const hasPermission = useHasPermission();

    return (permissions: PermissionsType): boolean =>
        modelExportEnabled && hasPermission(permissions.download);
};
export default useCanDownloadModel;
