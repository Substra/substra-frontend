import React from 'react';
import PropTypes from 'prop-types';

import {
    Table, Td, Th, Tr,
} from './table';
import CodeSample from '../../codeSample';

const PermissionsTabPanelContent = ({permissions, owner, asset}) => {
    const isPublic = permissions && permissions.process && permissions.process.public;
    const authorizedIDs = permissions && permissions.process && permissions.process.authorizedIDs;

    return (
        <>
            {isPublic && (
                <p>
                    {`This ${asset} is processable by anyone.`}
                </p>
            )}
            {!isPublic && !authorizedIDs && (
                <p>
                    {`This ${asset} is processable by its owner only (owner: ${owner})`}
                </p>
            )}
            {!isPublic && authorizedIDs && (
                <>
                    <p>
                        {`This ${asset} is processable by the following nodes only:`}
                    </p>
                    <Table>
                        <tbody>
                            <Tr>
                                <Th>Node ID</Th>
                            </Tr>
                            {authorizedIDs.map((nodeID) => (
                                <Tr key={nodeID}>
                                    <Td>{nodeID}</Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
            <p>Permissions object details:</p>
            <CodeSample
                filename="permissions.json"
                language="json"
                codeString={JSON.stringify(permissions, null, 2)}
            />
        </>
    );
};

PermissionsTabPanelContent.tabsRole = 'TabPanel';

PermissionsTabPanelContent.propTypes = {
    permissions: PropTypes.shape(),
    owner: PropTypes.string,
    asset: PropTypes.string,
};

PermissionsTabPanelContent.defaultProps = {
    permissions: null,
    owner: '',
    asset: '',
};

export default PermissionsTabPanelContent;
