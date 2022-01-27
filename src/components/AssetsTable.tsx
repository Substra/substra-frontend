import {
    Table,
    TableProps,
    Th,
    Text,
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

export const ClickableTh = ({
    children,
    onClick,
    ...props
}: TableColumnHeaderProps): JSX.Element => (
    <Th {...props}>
        <Text cursor="pointer" onClick={onClick} as="span">
            {children}
        </Text>
    </Th>
);

export const AssetsTablePermissionsTh = (props: TableColumnHeaderProps) => (
    <ClickableTh
        {...props}
        textAlign="right"
        width="140px"
        whiteSpace="nowrap"
        title="Permissions"
    >
        Permissions
    </ClickableTh>
);
export const AssetsTableCategoryTh = (props: TableColumnHeaderProps) => (
    <ClickableTh {...props} width="125px">
        Category
    </ClickableTh>
);
export const AssetsTableStatusTh = (props: TableColumnHeaderProps) => (
    <ClickableTh {...props} width="120px">
        Status
    </ClickableTh>
);
export const AssetsTableRankDurationTh = (props: TableColumnHeaderProps) => (
    <ClickableTh {...props} width="240px" whiteSpace="nowrap">
        Dates / Duration
    </ClickableTh>
);
