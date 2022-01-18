import { Text } from '@chakra-ui/react';

import { getNodeLabel } from '@/modules/nodes/NodesUtils';

import { DrawerSection, DrawerSectionEntry } from '@/components/DrawerSection';

export default ({
    metadata,
}: {
    metadata: Record<string, string>;
}): JSX.Element => {
    if (Object.keys(metadata).length === 0) {
        return (
            <DrawerSection title="Metadata">
                <Text fontSize="sm">N/A</Text>
            </DrawerSection>
        );
    }
    return (
        <DrawerSection title="Metadata">
            {Object.entries(metadata).map(([key, value]) => (
                <DrawerSectionEntry title={key} key={key}>
                    {/* This handles the case where metadata contains NodeId, for example with "Debug_worker" and "Partner_id" */}
                    {getNodeLabel(value)}
                </DrawerSectionEntry>
            ))}
        </DrawerSection>
    );
};
