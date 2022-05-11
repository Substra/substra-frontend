import { useContext } from 'react';

import { HStack, Td, Text, Th, Tr } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

interface HyperparametersProps {
    computePlan: ComputePlanT;
    hyperparametersList: string[];
}

const HyperparametersTr = ({
    computePlan,
    hyperparametersList,
}: HyperparametersProps): JSX.Element => {
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
                    <Text>{computePlan.metadata.name}</Text>
                </HStack>
            </Th>
            {hyperparametersList.map((hp) => (
                <Td
                    key={`${computePlan.key}-${hp}`}
                    fontSize="xs"
                    border="none"
                >
                    <Text>{computePlan.metadata[hp] || '-'}</Text>
                </Td>
            ))}
        </Tr>
    );
};

export default HyperparametersTr;
