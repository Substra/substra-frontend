import React, { Suspense } from 'react';

import { Skeleton, Text } from '@chakra-ui/react';

import { DrawerSection } from '@/components/DrawerSection';

const MarkdownSection = React.lazy(
    () => import('@/components/MarkdownSection')
);

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
            {loading && <Skeleton />}
            {!loading && !description && <Text fontSize="sm">N/A</Text>}
            {!loading && description && (
                <Suspense fallback={<Skeleton />}>
                    <MarkdownSection source={description} />
                </Suspense>
            )}
        </DrawerSection>
    );
};
export default DescriptionDrawerSection;
