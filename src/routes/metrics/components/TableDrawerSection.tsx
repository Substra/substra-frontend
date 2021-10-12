import DrawerSectionContainer from './DrawerSectionContainer';
import { HStack, Table, Tbody, Td, Tr } from '@chakra-ui/react';

import CopyButton from '@/components/CopyButton';

const TableDrawerSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <DrawerSectionContainer title={title}>
            <Table size="sm">
                <Tbody>{children}</Tbody>
            </Table>
        </DrawerSectionContainer>
    );
};

const TableDrawerSectionEntry = ({
    title,
    children,
}: {
    title: string;
    children?: React.ReactNode;
}): JSX.Element => {
    return (
        <Tr>
            <Td paddingLeft="0" fontSize="xs">
                {title}
            </Td>
            <Td textAlign="right" paddingRight="0" fontSize="xs">
                {children}
            </Td>
        </Tr>
    );
};

const TableDrawerSectionKeyEntry = ({
    value,
}: {
    value: string;
}): JSX.Element => (
    <TableDrawerSectionEntry title="Key">
        <HStack spacing={1.5} justifyContent="flex-end">
            <span>{value}</span>
            <CopyButton value={value} />
        </HStack>
    </TableDrawerSectionEntry>
);

export {
    TableDrawerSection,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
};
