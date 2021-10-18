import { VStack } from '@chakra-ui/react';

import DrawerSectionHeading from '@/components/DrawerSectionHeading';

export default ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): JSX.Element => (
    <VStack spacing={2.5} alignItems="flex-start">
        <DrawerSectionHeading title={title} />
        {children}
    </VStack>
);
