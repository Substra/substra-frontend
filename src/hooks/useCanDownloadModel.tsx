import { PermissionsType } from '@/modules/common/CommonTypes';

import { useAppSelector } from '@/hooks';
import useHasPermission from '@/hooks/useHasPermission';

const useCanDownloadModel = (): ((permissions: PermissionsType) => boolean) => {
    const modelExportEnabled = useAppSelector(
        (state) => !!state.nodes.info.config.model_export_enabled
    );
    const hasPermission = useHasPermission();

    return (permissions: PermissionsType): boolean =>
        modelExportEnabled && hasPermission(permissions.download);
};
export default useCanDownloadModel;
