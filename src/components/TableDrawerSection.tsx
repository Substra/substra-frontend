import DrawerSectionContainer from './DrawerSectionContainer';
import { HStack, Table, Td, Tr, Text } from '@chakra-ui/react';

import { capitalize, formatDate } from '@/libs/utils';

import CopyButton from '@/components/CopyButton';
import { Tbody } from '@/components/Table';

const TableDrawerSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <DrawerSectionContainer title={capitalize(title)}>
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
            <Td
                paddingLeft="0"
                fontSize="xs"
                verticalAlign="top"
                whiteSpace="nowrap"
            >
                {capitalize(title)}
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
            <Text isTruncated maxWidth="180px">
                {value}
            </Text>
            <CopyButton value={value} />
        </HStack>
    </TableDrawerSectionEntry>
);

const TableDrawerSectionDateEntry = ({
    date,
    title,
}: {
    date: string;
    title: string;
}): JSX.Element => (
    <TableDrawerSectionEntry title={capitalize(title)}>
        {formatDate(date)}
    </TableDrawerSectionEntry>
);

export {
    TableDrawerSection,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
    TableDrawerSectionDateEntry,
};
