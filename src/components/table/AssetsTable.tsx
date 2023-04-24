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

export const AssetsTablePermissionsTh = ({
    children,
    ...props
}: TableColumnHeaderProps) => (
    <Th
        textAlign="right"
        width="140px"
        whiteSpace="nowrap"
        title="Permissions"
        children={children || 'Permissions'}
        {...props}
    />
);
