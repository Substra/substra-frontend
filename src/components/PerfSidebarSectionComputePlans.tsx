import { useContext } from 'react';

import { Checkbox, List, ListItem, Text } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

import PerfSidebarSection from '@/components/PerfSidebarSection';

import { lightenColorName } from '@/assets/chakraTheme';

const ComputePlanCheckbox = ({
    computePlanKey,
    index,
}: {
    computePlanKey: string;
    index: number;
}): JSX.Element => {
    const {
        computePlans,
        selectedComputePlanKeys,
        onComputePlanKeySelectionChange,
    } = useContext(PerfBrowserContext);
    const { getColorScheme } = usePerfBrowserColors();

    const computePlan = computePlans.find((cp) => cp.key === computePlanKey);
    return (
        <Checkbox
            colorScheme={getColorScheme({ computePlanKey, worker: '' })}
            onChange={onComputePlanKeySelectionChange(computePlanKey)}
            isChecked={selectedComputePlanKeys.includes(computePlanKey)}
        >
            <Text as="span" fontSize="xs" fontWeight="semibold">
                {`CP${index + 1}`}
            </Text>
            {computePlan?.tag && (
                <>
                    <Text as="span" fontSize="xs" marginX="1">
                        •
                    </Text>
                    <Text as="span" fontSize="xs">
                        {computePlan.tag}
                    </Text>
                </>
            )}
        </Checkbox>
    );
};

const PerfSidebarSectionComputePlans = (): JSX.Element => {
    const {
        sortedComputePlanKeys,
        nodes,
        selectedNodeIds,
        selectedComputePlanKeys,
        selectedComputePlanNodes,
        onComputePlanNodeSelectionChange,
    } = useContext(PerfBrowserContext);
    const { getColorScheme } = usePerfBrowserColors();

    const nodeIds = nodes.map((node) => node.id);
    nodeIds.sort();

    const hasStatus = (computePlanKey: string, nodeId: string): boolean =>
        !!selectedComputePlanNodes[computePlanKey] &&
        selectedComputePlanNodes[computePlanKey][nodeId] !== undefined;

    return (
        <PerfSidebarSection title="Compute plans">
            <List spacing="6">
                {sortedComputePlanKeys.map((computePlanKey, index) => (
                    <ListItem key={computePlanKey}>
                        <ComputePlanCheckbox
                            computePlanKey={computePlanKey}
                            index={index}
                        />
                        <List paddingLeft="6" spacing="2.5" marginTop="2.5">
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
                                            colorScheme={lightenColorName(
                                                getColorScheme({
                                                    computePlanKey,
                                                    worker: nodeId,
                                                })
                                            )}
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
