import { useContext } from 'react';

import { HStack, Td, Text, Th, Tr } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

interface MetadataModalTrProps {
    computePlan: ComputePlanT;
    columns: string[];
}

const MetadataModalTr = ({
    computePlan,
    columns,
}: MetadataModalTrProps): JSX.Element => {
    const { getComputePlanIndex, computePlans } =
        useContext(PerfBrowserContext);
    return (
        <Tr color="gray.800">
            <Th
                fontSize="xs"
                border="none"
                position="sticky"
                left="0"
                zIndex="1"
                backgroundColor="white"
            >
                <HStack>
                    {computePlans.length > 1 && (
                        <Text color="black" fontWeight="semibold">
                            #{getComputePlanIndex(computePlan.key)}
                        </Text>
                    )}
                    <Text>{computePlan.name}</Text>
                </HStack>
            </Th>
            {columns.map((column) => (
                <Td
                    key={`${computePlan.key}-${column}`}
                    fontSize="xs"
                    border="none"
                >
                    <Text>{computePlan.metadata[column] || '-'}</Text>
                </Td>
            ))}
        </Tr>
    );
};

export default MetadataModalTr;
