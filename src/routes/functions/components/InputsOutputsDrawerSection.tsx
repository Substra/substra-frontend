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
import { getAssetKindLabel } from '@/routes/functions/FunctionsUtils';
import { FunctionT, FunctionInputT } from '@/types/FunctionsTypes';

import { DrawerSection } from '@/components/DrawerSection';

const InputsOutputsDrawerSection = ({
    loading,
    func,
    type,
}: {
    loading: boolean;
    func: FunctionT | null;
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
                        {(loading || !func) &&
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
                            func &&
                            Object.entries(func[type]).map(([key, input]) => (
                                <Tr key={key}>
                                    <Td paddingLeft="0 !important">
                                        <Code fontSize="xs">{key}</Code>
                                    </Td>
                                    <Td>{getAssetKindLabel(input.kind)}</Td>
                                    {type === 'inputs' && (
                                        <Td textAlign="center">
                                            {(input as FunctionInputT).optional
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
