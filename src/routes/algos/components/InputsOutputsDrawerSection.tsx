import {
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Code,
    Skeleton,
} from '@chakra-ui/react';

import { capitalize } from '@/libs/utils';
import { AlgoT, InputT } from '@/modules/algos/AlgosTypes';
import { getAssetKindLabel } from '@/modules/algos/AlgosUtils';

import { DrawerSection } from '@/components/DrawerSection';

const InputsOutputsDrawerSection = ({
    loading,
    algo,
    type,
}: {
    loading: boolean;
    algo: AlgoT | null;
    type: 'inputs' | 'outputs';
}) => {
    return (
        <DrawerSection title={capitalize(type)}>
            <TableContainer alignSelf="stretch">
                <Table size="md" width="100%" fontSize="xs">
                    <Thead>
                        <Tr>
                            <Th width="100%"></Th>
                            <Th>Kind</Th>
                            {type === 'inputs' && <Th>Optional</Th>}
                            <Th paddingRight="0 !important">Multiple</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {(loading || !algo) &&
                            [0, 1, 2].map((key) => (
                                <Tr key={key}>
                                    <Td paddingLeft="0 !important">
                                        <Skeleton>dummy</Skeleton>
                                    </Td>
                                    <Td>
                                        <Skeleton>Dummy</Skeleton>
                                    </Td>
                                    {type === 'inputs' && (
                                        <Td>
                                            <Skeleton>yes</Skeleton>
                                        </Td>
                                    )}
                                    <Td
                                        paddingRight="0 !important"
                                        textAlign="center"
                                    >
                                        <Skeleton>yes</Skeleton>
                                    </Td>
                                </Tr>
                            ))}
                        {!loading &&
                            algo &&
                            Object.entries(algo[type]).map(([key, input]) => (
                                <Tr key={key}>
                                    <Td paddingLeft="0 !important">
                                        <Code fontSize="xs">{key}</Code>
                                    </Td>
                                    <Td>{getAssetKindLabel(input.kind)}</Td>
                                    {type === 'inputs' && (
                                        <Td textAlign="center">
                                            {(input as InputT).optional
                                                ? 'yes'
                                                : 'no'}
                                        </Td>
                                    )}
                                    <Td
                                        paddingRight="0 !important"
                                        textAlign="center"
                                    >
                                        {input.multiple ? 'yes' : 'no'}
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </DrawerSection>
    );
};

export default InputsOutputsDrawerSection;
