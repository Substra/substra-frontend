import {
    Table,
    TableProps,
    Th,
    TableColumnHeaderProps,
} from '@chakra-ui/react';

export const AssetsTable = (props: TableProps): JSX.Element => (
    <Table
        size="md"
        width="870px"
        style={{ tableLayout: 'fixed' }}
        {...props}
    />
);

export const AssetsTablePermissionsTh = (props: TableColumnHeaderProps) => (
    <Th
        {...props}
        textAlign="right"
        width="140px"
        whiteSpace="nowrap"
        title="Permissions"
    >
        Permissions
    </Th>
);
