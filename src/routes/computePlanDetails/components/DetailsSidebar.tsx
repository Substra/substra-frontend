import { VStack, Flex, Text, Progress } from '@chakra-ui/react';

import { useAppSelector } from '@/hooks';

import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import Status, { getStatusStyle } from '@/components/Status';
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

    return (
        <VStack spacing="8" width="xs" alignItems="stretch">
            <DrawerSectionContainer title="Progression">
                <VStack
                    backgroundColor="white"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                    borderRadius="lg"
                    spacing="1.5"
                    padding="5"
                    alignItems="stretch"
                    alignSelf="stretch"
                >
                    {computePlan && (
                        <>
                            <Flex
                                justifyContent="space-between"
                                alignItems="flex-end"
                            >
                                <Text
                                    fontSize="md"
                                    lineHeight="6"
                                    fontWeight="semibold"
                                >
                                    {`${
                                        (100 * computePlan.done_count) /
                                        computePlan.task_count
                                    }%`}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    lineHeight="4"
                                    fontWeight="normal"
                                >{`${computePlan.done_count}/${computePlan.task_count}`}</Text>
                            </Flex>
                            <Progress
                                size="xs"
                                max={computePlan.task_count}
                                value={computePlan.done_count}
                                colorScheme={
                                    getStatusStyle(computePlan.status)
                                        .colorScheme
                                }
                            />
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
