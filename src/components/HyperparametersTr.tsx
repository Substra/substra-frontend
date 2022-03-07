import { HStack, Td, Text, Th, Tr } from '@chakra-ui/react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

interface HyperparametersProps {
    computePlan: ComputePlanT;
    hyperparametersList: string[];
    position: number;
}

const HyperparametersTr = ({
    computePlan,
    hyperparametersList,
    position,
}: HyperparametersProps): JSX.Element => {
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
                    <Text color="black" fontWeight="semibold">
                        #{position}
                    </Text>
                    <Text>{computePlan.metadata.name}</Text>
                </HStack>
            </Th>
            {hyperparametersList.map((hp) => (
                <Td
                    key={`${computePlan.tag}-${hp}`}
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
