import styled from '@emotion/styled';

import { PermissionsType, PermissionType } from '@/modules/common/CommonTypes';

import { downloadFromApi } from '@/libs/request';

import useAppSelector from '@/hooks/useAppSelector';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import Skeleton from '@/components/Skeleton';

import { Colors, Spaces } from '@/assets/theme';

const Ul = styled.ul`
    list-style-type: initial;
    list-style-position: inside;
    margin-top: ${Spaces.small};
    margin-left: ${Spaces.medium};
`;

const Code = styled.code`
    font-family: monospace;
    // this change in font-size is to make the monospace text visually as big as the Lato text
    font-size: 1.2em;
    padding: ${Spaces.extraSmall} ${Spaces.small};
    background-color: ${Colors.background};
    display: inline-block;
    border-radius: 4px;
`;

const DownloadButton = styled.button`
    padding: ${Spaces.small} ${Spaces.medium};
    color: ${Colors.primary};
    background: none;
    border: 1px solid ${Colors.border};
    border-radius: 20px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: ${Spaces.small};

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

export const LoadingPermissionSiderSection = (): JSX.Element => (
    <SiderSection>
        <SiderSectionTitle>Permissions</SiderSectionTitle>
        <Skeleton height={16} width={300} />
    </SiderSection>
);

interface PermissionProps {
    permission: PermissionType;
    title: string;
}
const Permission = ({ permission, title }: PermissionProps): JSX.Element => {
    if (permission.public) {
        return <p>{`${title} by anyone.`}</p>;
    }
    if (permission.authorized_ids.length === 1) {
        return (
            <p>
                {`${title} by its owner only:`}
                <Code>{permission.authorized_ids[0]}</Code>
            </p>
        );
    }
    return (
        <>
            <p>{`${title} by the following nodes:`}</p>
            <Ul>
                {permission.authorized_ids.map((nodeId) => (
                    <li key={nodeId}>
                        <Code>{nodeId}</Code>
                    </li>
                ))}
            </Ul>
        </>
    );
};

type PermissionSiderSectionProps = {
    title?: string;
    permissions: PermissionsType;
    modelKey?: string;
    modelUrl?: string;
    modelButtonTitle?: string;
};

const PermissionSiderSection = ({
    permissions,
    title,
    modelKey,
    modelUrl,
    modelButtonTitle,
}: PermissionSiderSectionProps): JSX.Element => {
    const modelExportEnabled = useAppSelector(
        (state) => state.nodes.info.config.model_export_enabled
    );
    const currentNodeID = useAppSelector((state) => state.nodes.info.node_id);

    const canDownload =
        permissions.download.public ||
        permissions.download.authorized_ids.includes(currentNodeID);

    return (
        <SiderSection>
            <SiderSectionTitle>{title || 'Permissions'}</SiderSectionTitle>
            <Permission title="Processable" permission={permissions.process} />
            <Permission
                title="Downloadable"
                permission={permissions.download}
            />
            {modelUrl && modelExportEnabled && canDownload && (
                <DownloadButton
                    onClick={() =>
                        downloadFromApi(modelUrl, `model_${modelKey}`)
                    }
                >
                    {modelButtonTitle}
                </DownloadButton>
            )}
        </SiderSection>
    );
};

export default PermissionSiderSection;
