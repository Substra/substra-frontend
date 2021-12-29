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
                paddingRight="1"
                fontSize="xs"
                verticalAlign="top"
                whiteSpace="nowrap"
            >
                {capitalize(title)}
            </Td>
            <Td paddingRight="0" paddingLeft="1" fontSize="xs">
                {children}
            </Td>
        </Tr>
    );
};

const TableDrawerSectionKeyEntry = ({
    value,
    maxWidth,
}: {
    value: string;
    maxWidth: string;
}): JSX.Element => (
    <TableDrawerSectionEntry title="Key">
        <HStack spacing={1.5}>
            <Text isTruncated maxWidth={maxWidth}>
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
