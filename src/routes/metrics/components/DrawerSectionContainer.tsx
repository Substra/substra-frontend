import DrawerSectionHeading from './DrawerSectionHeading';
import { VStack } from '@chakra-ui/react';

export default ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): JSX.Element => (
    <VStack spacing={5} alignItems="flex-start">
        <DrawerSectionHeading title={title} />
        {children}
    </VStack>
);
