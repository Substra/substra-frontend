import { Table, TableProps, Th } from '@chakra-ui/react';

export const AssetsTable = (props: TableProps): JSX.Element => (
    <Table
        size="md"
        width="870px"
        style={{ tableLayout: 'fixed' }}
        {...props}
    />
);

export const AssetsTablePermissionsTh = () => (
    <Th textAlign="right" width="155px" whiteSpace="nowrap">
        Permissions
    </Th>
);
export const AssetsTableCategoryTh = () => <Th width="125px">Category</Th>;
export const AssetsTableStatusTh = () => <Th width="135px">Status</Th>;
export const AssetsTableRankDurationTh = () => (
    <Th width="170px" textAlign="right" whiteSpace="nowrap">
        Rank / Duration
    </Th>
);
