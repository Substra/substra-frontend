import { useMemo, useState } from 'react';

import { Flex, HStack, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { SerieT } from '@/modules/series/SeriesTypes';
import { buildSeriesGroups } from '@/modules/series/SeriesUtils';

import usePerfBrowser, { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import LoadingState from '@/components/LoadingState';
import PerfCard from '@/components/PerfCard';
import PerfChart from '@/components/PerfChart';
import PerfDetails from '@/components/PerfDetails';
import PerfSidebarSection from '@/components/PerfSidebarSection';

interface PerfBrowserProps {
    series: SerieT[];
    loading: boolean;
    computePlans: ComputePlanT[];
    settingsComponents: React.FunctionComponent[];
    sectionComponents: React.FunctionComponent[];
    colorMode: 'computePlan' | 'node';
}

const PerfBrowser = ({
    loading,
    series,
    computePlans,
    settingsComponents,
    sectionComponents,
    colorMode,
}: PerfBrowserProps) => {
    const [selectedMetricName, setSelectedMetricName] = useState('');

    const { context } = usePerfBrowser(series, computePlans, colorMode);
    const {
        selectedNodeIds,
        selectedComputePlanKeys,
        selectedComputePlanNodes,
    } = context;

    const filteredSeries = series.filter(
        (serie) =>
            selectedComputePlanKeys.includes(serie.computePlanKey) &&
            selectedNodeIds.includes(serie.worker) &&
            selectedComputePlanNodes[serie.computePlanKey][serie.worker]
    );
    const seriesGroups = buildSeriesGroups(filteredSeries);

    const selectedSeriesGroup = useMemo(() => {
        if (!selectedMetricName) {
            return [];
        }

        const groupsMatchingMetric = seriesGroups.filter(
            (series) => series[0].metricName === selectedMetricName
        );

        if (groupsMatchingMetric.length > 0) {
            return groupsMatchingMetric[0];
        } else {
            return [];
        }
    }, [seriesGroups, selectedMetricName]);

    return (
        <PerfBrowserContext.Provider value={context}>
            <HStack
                flexGrow={1}
                spacing="0"
                alignItems="stretch"
                overflow="hidden"
            >
                <Flex
                    flexGrow={0}
                    flexShrink={0}
                    flexDirection="column"
                    width="300px"
                    backgroundColor="white"
                    overflowX="hidden"
                    overflowY="auto"
                >
                    {settingsComponents.length && (
                        <PerfSidebarSection title="Settings">
                            <VStack spacing="5" alignItems="stretch">
                                {settingsComponents.map((SettingsComponent) => (
                                    <SettingsComponent
                                        key={SettingsComponent.name}
                                    />
                                ))}
                            </VStack>
                        </PerfSidebarSection>
                    )}
                    {sectionComponents.map((SectionComponent) => (
                        <SectionComponent key={SectionComponent.name} />
                    ))}
                </Flex>
                <Flex
                    flexGrow={1}
                    flexWrap="wrap"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    overflowX="hidden"
                    overflowY="auto"
                >
                    {loading && (
                        <LoadingState message="Loading performance data" />
                    )}
                    {!loading && (
                        <>
                            {series.length === 0 && (
                                <Text padding="8">
                                    There is no data to display: there are no
                                    test tasks in status done.
                                </Text>
                            )}
                            {seriesGroups.length === 0 && (
                                <Text padding="8">
                                    Select at least one node to display the data
                                </Text>
                            )}
                            {selectedMetricName && (
                                <PerfDetails
                                    metricName={selectedMetricName}
                                    onBack={() => setSelectedMetricName('')}
                                    series={selectedSeriesGroup}
                                />
                            )}
                            {!selectedMetricName && (
                                <Wrap padding="8">
                                    {seriesGroups.map((series) => (
                                        <WrapItem
                                            key={`${series[0].metricKey}-${series[0].id}`}
                                        >
                                            <PerfCard
                                                title={series[0].metricName}
                                                onClick={() =>
                                                    setSelectedMetricName(
                                                        series[0].metricName
                                                    )
                                                }
                                            >
                                                <PerfChart
                                                    series={series}
                                                    interactive={false}
                                                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                    setHoveredRank={() => {}}
                                                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                    setSelectedRank={() => {}}
                                                />
                                            </PerfCard>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            )}
                        </>
                    )}
                </Flex>
            </HStack>
        </PerfBrowserContext.Provider>
    );
};

export default PerfBrowser;
