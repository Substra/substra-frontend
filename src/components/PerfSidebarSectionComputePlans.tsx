import { useContext } from 'react';

import { Checkbox, List, ListItem, Text } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfSidebarSection from '@/components/PerfSidebarSection';

const PerfSidebarSectionComputePlans = (): JSX.Element => {
    const {
        computePlans,
        nodes,
        selectedNodeIds,
        selectedComputePlanKeys,
        onComputePlanKeySelectionChange,
        selectedComputePlanNodes,
        onComputePlanNodeSelectionChange,
    } = useContext(PerfBrowserContext);

    const computePlanKeys = computePlans.map((computePlan) => computePlan.key);
    computePlanKeys.sort();

    const nodeIds = nodes.map((node) => node.id);
    nodeIds.sort();

    const hasStatus = (computePlanKey: string, nodeId: string): boolean =>
        !!selectedComputePlanNodes[computePlanKey] &&
        selectedComputePlanNodes[computePlanKey][nodeId] !== undefined;

    return (
        <PerfSidebarSection title="Compute plans">
            <List>
                {computePlanKeys.map((computePlanKey, index) => (
                    <ListItem key={computePlanKey}>
                        <Checkbox
                            colorScheme="teal"
                            onChange={onComputePlanKeySelectionChange(
                                computePlanKey
                            )}
                            isChecked={selectedComputePlanKeys.includes(
                                computePlanKey
                            )}
                        >
                            <Text as="span" fontSize="xs" fontWeight="semibold">
                                {`CP${index + 1}`}
                            </Text>
                            <Text as="span" fontSize="xs" marginX="1">
                                •
                            </Text>
                            <Text as="span" fontSize="xs">
                                {
                                    computePlans.find(
                                        (computePlan) =>
                                            computePlan.key === computePlanKey
                                    )?.tag
                                }
                            </Text>
                        </Checkbox>
                        <List paddingLeft="6">
                            {nodeIds
                                .filter(
                                    (nodeId) =>
                                        hasStatus(computePlanKey, nodeId) &&
                                        selectedNodeIds.includes(nodeId)
                                )
                                .map((nodeId) => (
                                    <ListItem
                                        key={`${computePlanKey}-${nodeId}`}
                                    >
                                        <Checkbox
                                            colorScheme="teal"
                                            onChange={onComputePlanNodeSelectionChange(
                                                computePlanKey,
                                                nodeId
                                            )}
                                            isChecked={
                                                selectedComputePlanNodes[
                                                    computePlanKey
                                                ][nodeId]
                                            }
                                            isDisabled={
                                                !selectedComputePlanKeys.includes(
                                                    computePlanKey
                                                )
                                            }
                                        >
                                            <Text as="span" fontSize="xs">
                                                {nodeId}
                                            </Text>
                                        </Checkbox>
                                    </ListItem>
                                ))}
                            {nodeIds.filter(
                                (nodeId) =>
                                    hasStatus(computePlanKey, nodeId) &&
                                    selectedNodeIds.includes(nodeId)
                            ).length === 0 && (
                                <ListItem fontSize="xs">
                                    No node to display
                                </ListItem>
                            )}
                        </List>
                    </ListItem>
                ))}
            </List>
        </PerfSidebarSection>
    );
};

export default PerfSidebarSectionComputePlans;
