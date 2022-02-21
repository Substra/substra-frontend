import { useContext, useMemo } from 'react';

import { Flex, HStack, VStack } from '@chakra-ui/react';

import { buildSeriesGroups } from '@/modules/series/SeriesUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfDetails from '@/components/PerfDetails';
import PerfList from '@/components/PerfList';
import PerfLoadingState from '@/components/PerfLoadingState';
import PerfSidebarSection from '@/components/PerfSidebarSection';

interface PerfBrowserProps {
    settingsComponents: React.FunctionComponent[];
    sectionComponents: React.FunctionComponent[];
}

const PerfBrowser = ({
    settingsComponents,
    sectionComponents,
}: PerfBrowserProps) => {
    const {
        series,
        loading,
        selectedNodeIds,
        selectedComputePlanKeys,
        selectedComputePlanNodes,
        selectedMetricName,
        setSelectedMetricName,
    } = useContext(PerfBrowserContext);

    const filteredSeries = series.filter(
        (serie) =>
            selectedComputePlanKeys.includes(serie.computePlanKey) &&
            selectedNodeIds.includes(serie.worker) &&
            !!selectedComputePlanNodes[serie.computePlanKey] &&
            selectedComputePlanNodes[serie.computePlanKey][serie.worker]
    );
    const seriesGroups = buildSeriesGroups(filteredSeries);

    const selectedSeriesGroup = useMemo(() => {
        if (!selectedMetricName) {
            return [];
        }

        const groupsMatchingMetric = seriesGroups.filter(
            (series) =>
                series[0].metricName.toLowerCase() ===
                selectedMetricName.toLowerCase()
        );

        if (groupsMatchingMetric.length > 0) {
            return groupsMatchingMetric[0];
        } else {
            return [];
        }
    }, [seriesGroups, selectedMetricName]);

    return (
        <HStack
            flexGrow={1}
            spacing="0"
            alignItems="stretch"
            overflow="hidden"
            alignSelf="stretch"
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
                {settingsComponents.length > 0 && (
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
                {loading && <PerfLoadingState />}
                {!loading && (
                    <>
                        {selectedMetricName && (
                            <PerfDetails
                                metricName={selectedMetricName}
                                onBack={() => setSelectedMetricName('')}
                                series={selectedSeriesGroup}
                            />
                        )}
                        {!selectedMetricName && (
                            <PerfList
                                seriesGroups={seriesGroups}
                                onCardClick={(metricName) =>
                                    setSelectedMetricName(metricName)
                                }
                            />
                        )}
                    </>
                )}
            </Flex>
        </HStack>
    );
};

export default PerfBrowser;
