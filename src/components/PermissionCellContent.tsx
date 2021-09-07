import { PermissionsType, PermissionType } from '@/modules/common/CommonTypes';

type PermissionCellContentProps = {
    permissions: PermissionsType;
};

const formatter = (title: string, permission: PermissionType): string => {
    if (permission.public) {
        return `${title} by anyone`;
    } else if (permission.authorized_ids.length === 1) {
        return `${title} by its owner only`;
    }
    return 'Restricted';
};

const PermissionCellContent = ({
    permissions,
}: PermissionCellContentProps): JSX.Element => {
    return (
        <>
            {formatter('Processable', permissions.process)}
            <br />
            {formatter('Downloadable', permissions.download)}
        </>
    );
};

export default PermissionCellContent;
