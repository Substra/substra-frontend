import { useContext } from 'react';

import { Checkbox, List, ListItem, Skeleton, Text } from '@chakra-ui/react';

import { getMelloddyName } from '@/modules/computePlans/ComputePlanUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

import PerfSidebarSection from '@/components/PerfSidebarSection';

import { lightenColorName } from '@/assets/chakraTheme';

declare const MELLODDY: boolean;

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
                {`#${index + 1}`}
            </Text>
            {MELLODDY && computePlan && (
                <>
                    <Text as="span" fontSize="xs" marginX="1">
                        •
                    </Text>
                    <Text as="span" fontSize="xs">
                        {getMelloddyName(computePlan)}
                    </Text>
                </>
            )}
            {!MELLODDY && computePlan?.tag && (
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

const LoadingState = (): JSX.Element => {
    return (
        <>
            <ListItem>
                <Skeleton width="100px" height="16px" />
                <List paddingLeft="6" spacing="2.5" marginTop="2.5">
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                </List>
            </ListItem>
            <ListItem>
                <Skeleton width="100px" height="16px" />
                <List paddingLeft="6" spacing="2.5" marginTop="2.5">
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                    <ListItem>
                        <Skeleton width="200px" height="16px" />
                    </ListItem>
                </List>
            </ListItem>
        </>
    );
};

const hierarchyBackgrounds = ({
    vlBottom,
    hlTop,
    hlSpacing,
}: {
    vlBottom: number;
    hlTop: number;
    hlSpacing: number;
}) => ({
    backgroundImage:
        'linear-gradient(var(--chakra-colors-gray-300), var(--chakra-colors-gray-300)), ' +
        `repeating-linear-gradient(transparent 0, transparent ${hlTop}px, var(--chakra-colors-gray-300) ${hlTop}px, var(--chakra-colors-gray-300) ${
            hlTop + 1
        }px, transparent ${hlTop + 1}px, transparent ${hlSpacing}px);`,

    backgroundSize: `1px calc(100% - ${vlBottom}px), 10px 100%`,
    backgroundPosition: '7px 0, 7px 0',
    backgroundRepeat: 'no-repeat, repeat-y',
});

const PerfSidebarSectionComputePlans = (): JSX.Element => {
    const {
        sortedComputePlanKeys,
        nodes,
        selectedNodeIds,
        selectedComputePlanKeys,
        selectedComputePlanNodes,
        onComputePlanNodeSelectionChange,
        loading,
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
                {loading && <LoadingState />}
                {!loading &&
                    sortedComputePlanKeys.map((computePlanKey, index) => (
                        <ListItem key={computePlanKey}>
                            <ComputePlanCheckbox
                                computePlanKey={computePlanKey}
                                index={index}
                            />
                            <List
                                paddingLeft="6"
                                spacing="2.5"
                                marginTop="2.5"
                                {...hierarchyBackgrounds({
                                    vlBottom: 10,
                                    hlTop: 13,
                                    hlSpacing: 34,
                                })}
                            >
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
                            </List>
                            {nodeIds.filter(
                                (nodeId) =>
                                    hasStatus(computePlanKey, nodeId) &&
                                    selectedNodeIds.includes(nodeId)
                            ).length === 0 && (
                                <List
                                    paddingLeft="6"
                                    spacing="2.5"
                                    marginTop="2.5"
                                    {...hierarchyBackgrounds({
                                        vlBottom: 8,
                                        hlTop: 9,
                                        hlSpacing: 0,
                                    })}
                                >
                                    <ListItem fontSize="xs">
                                        No node to display
                                    </ListItem>
                                </List>
                            )}
                        </ListItem>
                    ))}
            </List>
        </PerfSidebarSection>
    );
};

export default PerfSidebarSectionComputePlans;
