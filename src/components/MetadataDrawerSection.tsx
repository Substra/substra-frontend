import { Text } from '@chakra-ui/react';

import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import {
    TableDrawerSection,
    TableDrawerSectionEntry,
} from '@/components/TableDrawerSection';

export default ({
    metadata,
}: {
    metadata: Record<string, string>;
}): JSX.Element => {
    if (Object.keys(metadata).length === 0) {
        return (
            <DrawerSectionContainer title="Metadata">
                <Text fontSize="sm">N/A</Text>
            </DrawerSectionContainer>
        );
    }
    return (
        <TableDrawerSection title="Metadata">
            {Object.entries(metadata).map(([key, value]) => (
                <TableDrawerSectionEntry title={key} key={key}>
                    {value}
                </TableDrawerSectionEntry>
            ))}
        </TableDrawerSection>
    );
};
