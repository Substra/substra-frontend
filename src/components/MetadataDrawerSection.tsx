import { SkeletonText, Text } from '@chakra-ui/react';

import { DrawerSection, DrawerSectionEntry } from '@/components/DrawerSection';

export default ({
    metadata,
    loading,
}: {
    metadata: Record<string, string> | undefined;
    loading?: boolean;
}): JSX.Element => {
    if (loading || !metadata) {
        return (
            <DrawerSection title="Metadata">
                <SkeletonText height="4" width="250px" noOfLines={2} />
            </DrawerSection>
        );
    }
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
                    {value}
                </DrawerSectionEntry>
            ))}
        </DrawerSection>
    );
};
