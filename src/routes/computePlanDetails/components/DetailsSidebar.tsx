import { VStack, Flex, Text } from '@chakra-ui/react';

import { useAppSelector } from '@/hooks';

import ComputePlanProgressBar from '@/components/ComputePlanProgressBar';
import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import Status from '@/components/Status';
import {
    TableDrawerSection,
    TableDrawerSectionCreatedEntry,
    TableDrawerSectionEntry,
    TableDrawerSectionKeyEntry,
} from '@/components/TableDrawerSection';

const DetailsSidebar = (): JSX.Element => {
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const percentageDisplay =
        computePlan && computePlan.task_count > 0
            ? ((100 * computePlan.done_count) / computePlan.task_count).toFixed(
                  0
              )
            : 0;

    return (
        <VStack spacing="8" width="xs" alignItems="stretch">
            <DrawerSectionContainer title="Progression">
                <VStack
                    backgroundColor="white"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                    spacing="1.5"
                    padding="5"
                    alignItems="stretch"
                    alignSelf="stretch"
                >
                    {computePlan && (
                        <>
                            <Flex justifyContent="space-between">
                                <Text
                                    fontSize="md"
                                    lineHeight="6"
                                    fontWeight="semibold"
                                >
                                    {`${percentageDisplay}%`}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    lineHeight="4"
                                    fontWeight="normal"
                                >{`${computePlan.done_count}/${computePlan.task_count}`}</Text>
                            </Flex>
                            <ComputePlanProgressBar computePlan={computePlan} />
                        </>
                    )}
                </VStack>
            </DrawerSectionContainer>
            <TableDrawerSection title="General">
                {computePlan && (
                    <>
                        <TableDrawerSectionEntry title="Status">
                            <Status
                                status={computePlan.status}
                                size="sm"
                                variant="solid"
                            />
                        </TableDrawerSectionEntry>
                        <TableDrawerSectionKeyEntry value={computePlan.key} />
                        <TableDrawerSectionCreatedEntry
                            date={computePlan.creation_date}
                        />
                        <TableDrawerSectionEntry title="Owner">
                            {computePlan.owner}
                        </TableDrawerSectionEntry>
                    </>
                )}
            </TableDrawerSection>
            {computePlan && (
                <MetadataDrawerSection metadata={computePlan.metadata} />
            )}
        </VStack>
    );
};

export default DetailsSidebar;
