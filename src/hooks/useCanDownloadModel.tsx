import { PermissionsType } from '@/modules/common/CommonTypes';

import { useAppSelector } from '@/hooks';

const useCanDownloadModel = (): ((permissions: PermissionsType) => boolean) => {
    const currentNodeID = useAppSelector((state) => state.nodes.info.node_id);
    const modelExportEnabled = useAppSelector(
        (state) => !!state.nodes.info.config.model_export_enabled
    );

    return (permissions: PermissionsType): boolean =>
        modelExportEnabled &&
        (permissions.download.public ||
            permissions.download.authorized_ids.includes(currentNodeID));
};
export default useCanDownloadModel;
