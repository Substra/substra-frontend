import { useContext } from 'react';

import { HStack, List, ListItem, Text } from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import IconTag from '@/components/IconTag';

const TOOLTIP_WIDTH = 340;

interface PerfChartTooltipProps {
    x: number;
    y: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPoint[];
}

const PerfChartTooltip = ({
    x,
    y,
    showTooltip,
    hideTooltip,
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const { computePlans } = useContext(PerfBrowserContext);

    const computePlanKeys = computePlans.map((computePlan) => computePlan.key);
    computePlanKeys.sort();

    return (
        <List
            backgroundColor="rgba(255,255,255, 0.92)"
            position="absolute"
            top={`${y}px`}
            left={`${x + 10}px`}
            width={`${TOOLTIP_WIDTH}px`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            padding="3"
            boxShadow="md"
        >
            {points.map((point) => (
                <ListItem
                    key={point.testTaskKey}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <HStack spacing="2.5">
                        <IconTag
                            icon={RiGitCommitLine}
                            backgroundColor="teal.100"
                            fill="teal.500"
                        />
                        <HStack spacing="1">
                            <Text fontSize="xs" fontWeight="semibold">
                                {`CP${
                                    computePlanKeys.indexOf(
                                        point.computePlanKey
                                    ) + 1
                                } • ${point.worker}`}
                            </Text>
                            <Text as="span" fontSize="xs">
                                {`• L${point.serieId}`}
                            </Text>
                        </HStack>
                    </HStack>
                    <Text fontSize="xs">{point.y.toFixed(2)}</Text>
                </ListItem>
            ))}
        </List>
    );
};

export default PerfChartTooltip;
