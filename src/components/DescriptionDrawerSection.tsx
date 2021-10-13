import { Skeleton, Text } from '@chakra-ui/react';

import DrawerSectionContainer from '@/components/DrawerSectionContainer';
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
        <DrawerSectionContainer title="Description">
            {loading && <Skeleton></Skeleton>}
            {!loading && !description && <Text fontSize="sm">N/A</Text>}
            {!loading && description && (
                <MarkdownSection source={description} />
            )}
        </DrawerSectionContainer>
    );
};
export default DescriptionDrawerSection;
