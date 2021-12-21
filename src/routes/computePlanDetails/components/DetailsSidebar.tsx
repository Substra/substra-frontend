import { VStack, Flex, Text } from '@chakra-ui/react';

import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';

import { getDiffDates } from '@/libs/utils';

import { useAppSelector } from '@/hooks';

import ComputePlanProgressBar from '@/components/ComputePlanProgressBar';
import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import MetadataDrawerSection from '@/components/MetadataDrawerSection';
import Status from '@/components/Status';
import {
    TableDrawerSection,
    TableDrawerSectionDateEntry,
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
                            {computePlan.status === ComputePlanStatus.doing && (
                                <>
                                    {computePlan.start_date && (
                                        <Flex
                                            width="100%"
                                            fontSize="xs"
                                            justifyContent="space-between"
                                        >
                                            <Text>Duration</Text>
                                            <Text>
                                                {getDiffDates(
                                                    computePlan.start_date,
                                                    'now'
                                                )}
                                            </Text>
                                        </Flex>
                                    )}
                                    {computePlan.estimated_end_date && (
                                        <Flex
                                            width="100%"
                                            fontSize="xs"
                                            justifyContent="space-between"
                                        >
                                            <Text>Remaining</Text>
                                            <Text>
                                                {getDiffDates(
                                                    'now',
                                                    computePlan.estimated_end_date
                                                )}
                                            </Text>
                                        </Flex>
                                    )}
                                </>
                            )}
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
                        <TableDrawerSectionKeyEntry
                            value={computePlan.key}
                            maxWidth="180px"
                        />
                        <TableDrawerSectionDateEntry
                            title="Created"
                            date={computePlan.creation_date}
                        />
                        {computePlan.start_date && (
                            <TableDrawerSectionDateEntry
                                title="Started"
                                date={computePlan.start_date}
                            />
                        )}
                        {computePlan.end_date && (
                            <TableDrawerSectionDateEntry
                                title="Ended"
                                date={computePlan.end_date}
                            />
                        )}
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
