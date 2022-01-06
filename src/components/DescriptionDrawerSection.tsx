import { Skeleton, Text } from '@chakra-ui/react';

import { DrawerSection } from '@/components/DrawerSection';
import MarkdownSection from '@/components/MarkdownSection';

interface DescriptionDrawerSectionProps {
    description?: string;
    loading: boolean;
}

const DescriptionDrawerSection = ({
    description,
    loading,
}: DescriptionDrawerSectionProps): JSX.Element => {
    return (
        <DrawerSection title="Description">
            {loading && <Skeleton></Skeleton>}
            {!loading && !description && <Text fontSize="sm">N/A</Text>}
            {!loading && description && (
                <MarkdownSection source={description} />
            )}
        </DrawerSection>
    );
};
export default DescriptionDrawerSection;
