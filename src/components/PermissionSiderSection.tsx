import React from 'react';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import { PermissionType } from '@/modules/datasets/DatasetsTypes';
import styled from '@emotion/styled';
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

type PermissionSiderSectionProps = {
    permission: PermissionType;
};

const PermissionSiderSection = ({
    permission,
}: PermissionSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>Permissions</SiderSectionTitle>
            {permission.public && <p>Processable by anyone.</p>}
            {!permission.public && permission.authorized_ids.length === 1 && (
                <p>
                    Processable by its owner only:
                    <Code>{permission.authorized_ids[0]}</Code>
                </p>
            )}
            {!permission.public && permission.authorized_ids.length > 1 && (
                <>
                    <p>Processable by the following nodes:</p>
                    <Ul>
                        {permission.authorized_ids.map((nodeId) => (
                            <li key={nodeId}>
                                <Code>{nodeId}</Code>
                            </li>
                        ))}
                    </Ul>
                </>
            )}
        </SiderSection>
    );
};

export default PermissionSiderSection;
