import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { OnOptionChange } from '@/hooks/useSelection';
import {
    useSyncedState,
    useSyncedStringArrayState,
    useSyncedStringState,
} from '@/hooks/useSyncedState';
import { compareComputePlans } from '@/modules/computePlans/ComputePlanUtils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { OrganizationType } from '@/modules/organizations/OrganizationsTypes';
import { compareOrganizations } from '@/modules/organizations/OrganizationsUtils';
import {
    HighlightedSerie,
    SerieRankData,
    SerieT,
} from '@/modules/series/SeriesTypes';
import {
    buildSeriesGroups,
    compareSerieRankData,
    compareSeries,
    getMaxRankWithPerf,
    getMaxRoundWithPerf,
    getSeriesOrganizations,
} from '@/modules/series/SeriesUtils';

export type XAxisMode = 'round' | 'rank';

interface PerfBrowserContext {
    // Whether the compute plan and series are being loaded
    loading: boolean;
    // List of all compute plans we're browsing series for
    computePlans: ComputePlanT[];
    // List of all the series that can be extracted from the computePlans
    series: SerieT[];
    // List of groups of series sharing the same metric name once all filters have been applied
    seriesGroups: SerieT[][];
    // List of groups of series sharing the same metric name where all points of the series contain the round metadata
    seriesGroupsWithRounds: SerieT[][];
    // List of the organizations references by all the series
    organizations: OrganizationType[];
    // How colors should be determined
    colorMode: 'computePlan' | 'organization';
    // What unit to use for the x axis
    xAxisMode: XAxisMode;
    setXAxisMode: (xAxisMode: XAxisMode) => void;
    // List of organizations for which display series (displayed if serie.worker is in selectedOrganizationIds)
    selectedOrganizationIds: string[];
    setSelectedOrganizationIds: (selectedOrganizationIds: string[]) => void;
    isOrganizationIdSelected: (organizationId: string) => boolean;
    // List of compute plans for which to display series (display if serie.computePlanKey is in selectedComputePlanKeys)
    selectedComputePlanKeys: string[];
    setSelectedComputePlanKeys: (selectedComputePlanKeys: string[]) => void;
    onComputePlanKeySelectionChange: OnOptionChange;
    // Currently selected metric with its series
    selectedMetricName: string;
    setSelectedMetricName: (name: string) => void;
    selectedSeriesGroup: SerieT[];
    // Serie, compute plan and organization to highlight on charts
    highlightedSerie: HighlightedSerie | undefined;
    setHighlightedSerie: (
        highlightedSerie: HighlightedSerie | undefined
    ) => void;
    highlightedComputePlanKey: string | undefined;
    setHighlightedComputePlanKey: (key: string | undefined) => void;
    highlightedOrganizationId: string | undefined;
    setHighlightedOrganizationId: (organizationId: string | undefined) => void;
    // Hovered / selected rank on chart
    hoveredRank: number | null;
    setHoveredRank: (hoveredRank: number | null) => void;
    selectedRank: number | null;
    setSelectedRank: (selectedRank: number | null) => void;
    rankData: SerieRankData[];
    // chart reference for JPEG export
    perfChartRef: React.RefObject<HTMLDivElement>;
    // test task drawer
    drawerTestTaskKey: string | null;
    setDrawerTestTaskKey: (key: string | null) => void;
    // indexes
    getComputePlanIndex: (computePlanKey: string) => string;
    getOrganizationIndex: (
        computePlanKey: string,
        organizationId: string
    ) => string;
    getSerieIndex: (computePlanKey: string, serieId: string) => string;
}

/* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
export const PerfBrowserContext = createContext<PerfBrowserContext>({
    loading: true,
    computePlans: [],
    series: [],
    seriesGroups: [],
    seriesGroupsWithRounds: [],
    organizations: [],
    colorMode: 'organization',
    xAxisMode: 'rank',
    setXAxisMode: (xAxisMode) => {},
    selectedOrganizationIds: [],
    setSelectedOrganizationIds: (selectedOrganizationIds) => {},
    isOrganizationIdSelected: (organizationId) => false,
    selectedComputePlanKeys: [],
    setSelectedComputePlanKeys: (selectedComputePlanKeys) => {},
    onComputePlanKeySelectionChange:
        (computePlanKey: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {},
    selectedMetricName: '',
    setSelectedMetricName: (name: string) => {},
    selectedSeriesGroup: [],
    highlightedSerie: undefined,
    setHighlightedSerie: (highlightedSerie) => {},
    highlightedComputePlanKey: undefined,
    setHighlightedComputePlanKey: (computePlanKey) => {},
    highlightedOrganizationId: undefined,
    setHighlightedOrganizationId: (organizationId) => {},
    hoveredRank: null,
    setHoveredRank: (hoveredRank) => {},
    selectedRank: null,
    setSelectedRank: (selectedRank) => {},
    rankData: [],
    perfChartRef: { current: null },
    drawerTestTaskKey: null,
    setDrawerTestTaskKey: (key) => {},
    getComputePlanIndex: (computePlanKey: string) => '',
    getOrganizationIndex: (computePlanKey: string, organizationId: string) =>
        '',
    getSerieIndex: (computePlanKey: string, serieId: string) => '',
});
/* eslint-enable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */

const usePerfBrowser = (
    series: SerieT[],
    unsortedComputePlans: ComputePlanT[],
    colorMode: 'computePlan' | 'organization',
    loading: boolean
): {
    context: PerfBrowserContext;
} => {
    const [selectedOrganizationIds, setSelectedOrganizationIds] =
        useSyncedStringArrayState('selectedOrganizationIds', []);
    const [selectedComputePlanKeys, setSelectedComputePlanKeys] =
        useSyncedStringArrayState('selectedComputePlanKeys', []);
    const [hoveredRank, setHoveredRank] = useState<number | null>(null);
    const [selectedRank, setSelectedRank] = useState<number | null>(null);
    const [selectedMetricName, setSelectedMetricName] = useSyncedStringState(
        'selectedMetricName',
        ''
    );
    const [highlightedSerie, setHighlightedSerie] =
        useState<HighlightedSerie>();
    const [highlightedComputePlanKey, setHighlightedComputePlanKey] =
        useState<string>();
    const [highlightedOrganizationId, setHighlightedOrganizationId] =
        useState<string>();

    const computePlans = useMemo(() => {
        const computePlans = [...unsortedComputePlans];
        computePlans.sort(compareComputePlans);
        return computePlans;
    }, [unsortedComputePlans]);

    const isOrganizationIdSelected = useCallback(
        (organizationId: string): boolean =>
            selectedOrganizationIds.length === 0 ||
            selectedOrganizationIds.includes(organizationId),
        [selectedOrganizationIds]
    );

    const onComputePlanKeySelectionChange =
        (computePlanKey: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            const selected = selectedComputePlanKeys.includes(computePlanKey);

            if (checked && !selected) {
                setSelectedComputePlanKeys([
                    ...selectedComputePlanKeys,
                    computePlanKey,
                ]);
            }

            if (!checked && selected) {
                setSelectedComputePlanKeys(
                    selectedComputePlanKeys.filter(
                        (key) => key !== computePlanKey
                    )
                );
            }
        };

    const organizations = useMemo(() => {
        const organizations = getSeriesOrganizations(series);
        organizations.sort(compareOrganizations);
        return organizations;
    }, [series]);

    // Define seriesGroups and selectedSeriesGroup
    const seriesGroups = useMemo(() => {
        const filteredSeries = series.filter(
            (serie) =>
                selectedComputePlanKeys.includes(serie.computePlanKey) &&
                isOrganizationIdSelected(serie.worker)
        );
        return buildSeriesGroups(filteredSeries);
    }, [series, selectedComputePlanKeys, isOrganizationIdSelected]);

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

    useEffect(() => {
        setSelectedComputePlanKeys(
            computePlans.map((computePlan) => computePlan.key)
        );
    }, [computePlans, setSelectedComputePlanKeys]);

    const seriesGroupsWithRounds = useMemo(() => {
        const groupsWithRounds = seriesGroups
            .map((series) => {
                return series.filter((serie) => {
                    for (const point of serie.points) {
                        if (point.round < 0 || isNaN(point.round)) {
                            return false;
                        }
                    }
                    return true;
                });
            })
            .filter((series) => series.length);
        return groupsWithRounds;
    }, [seriesGroups]);

    const [xAxisMode, setXAxisMode] = useSyncedState<XAxisMode>(
        'xAxisMode',
        'rank',
        (v) => v as XAxisMode,
        (v) => v
    );

    const perfChartRef = useRef<HTMLDivElement>(null);

    const rankData = useMemo(() => {
        if (selectedSeriesGroup.length === 0) {
            return [];
        }
        const getRankData = (rank: number): SerieRankData[] => {
            return selectedSeriesGroup.map((serie) => {
                // Look for rank or round based on X axis mode
                const point = serie.points.find((p) => p[xAxisMode] === rank);

                let perf = '-';
                if (point?.perf) {
                    perf = point.perf.toFixed(3);
                }

                return {
                    id: serie.id,
                    computePlanKey: serie.computePlanKey,
                    testTaskKey: point ? point.testTaskKey : null,
                    worker: serie.worker,
                    perf,
                };
            });
        };

        let rankData: SerieRankData[] = [];
        if (selectedRank !== null) {
            rankData = getRankData(selectedRank);
        } else if (hoveredRank !== null) {
            rankData = getRankData(hoveredRank);
        } else {
            let max: number;
            switch (xAxisMode) {
                case 'round':
                    max = getMaxRoundWithPerf(selectedSeriesGroup);
                    break;
                case 'rank':
                default:
                    max = getMaxRankWithPerf(selectedSeriesGroup);
            }
            rankData = getRankData(max);
        }
        rankData.sort(compareSerieRankData);
        return rankData;
    }, [selectedSeriesGroup, hoveredRank, selectedRank, xAxisMode]);

    const [drawerTestTaskKey, setDrawerTestTaskKey] = useState<string | null>(
        null
    );

    const { getComputePlanIndex, getOrganizationIndex, getSerieIndex } =
        useMemo(() => {
            // object where keys are compute plan keys, values are the index to display
            const computePlanIndexes: Record<string, string> = {};
            // object of objects where keys are compute plan keys, values are themselves
            // objects where keys are organization ids and values are the index to display
            const organizationIndexes: Record<
                string,
                Record<string, string>
            > = {};
            // object of objects where keys are compute plan keys, values are themselves
            // objects where keys are serie ids and values are the index to display
            const serieIndexes: Record<string, Record<string, string>> = {};

            for (const [i, computePlan] of computePlans.entries()) {
                const cpIndex = `${i + 1}`;
                computePlanIndexes[computePlan.key] = cpIndex;
                organizationIndexes[computePlan.key] = {};
                serieIndexes[computePlan.key] = {};

                const cpSeries = series.filter(
                    (serie) => serie.computePlanKey === computePlan.key
                );
                const cpOrganizations = organizations.filter(
                    (organization) =>
                        !!cpSeries.find(
                            (serie) => serie.worker === organization.id
                        )
                );
                for (const [j, organization] of cpOrganizations.entries()) {
                    const organizationIndex =
                        computePlans.length === 1
                            ? `${j + 1}`
                            : `${cpIndex}.${j + 1}`;
                    organizationIndexes[computePlan.key][organization.id] =
                        organizationIndex;

                    const cpOrganizationSeries = cpSeries.filter(
                        (serie) => serie.worker === organization.id
                    );

                    const seriesGroups =
                        buildSeriesGroups(cpOrganizationSeries);
                    for (const serieGroup of seriesGroups) {
                        if (serieGroup.length === 1) {
                            serieIndexes[computePlan.key][serieGroup[0].id] =
                                organizationIndex;
                        } else if (serieGroup.length > 1) {
                            serieGroup.sort(compareSeries);
                            for (const [k, serie] of serieGroup.entries()) {
                                const serieIndex = `${organizationIndex}.${
                                    k + 1
                                }`;
                                serieIndexes[computePlan.key][serie.id] =
                                    serieIndex;
                            }
                        }
                    }
                }
            }

            return {
                getComputePlanIndex: (computePlanKey: string): string =>
                    computePlanIndexes[computePlanKey],
                getOrganizationIndex: (
                    computePlanKey: string,
                    organizationId: string
                ): string =>
                    organizationIndexes[computePlanKey][organizationId],
                getSerieIndex: (
                    computePlanKey: string,
                    serieId: string
                ): string => serieIndexes[computePlanKey][serieId],
            };
        }, [computePlans, organizations, series]);

    return {
        context: {
            loading,
            // series
            series,
            seriesGroups,
            seriesGroupsWithRounds,
            computePlans,
            organizations,
            colorMode,
            // xAxisMode
            xAxisMode,
            setXAxisMode,
            // organization IDs
            selectedOrganizationIds,
            setSelectedOrganizationIds,
            isOrganizationIdSelected,
            // compute plan keys
            selectedComputePlanKeys,
            onComputePlanKeySelectionChange,
            setSelectedComputePlanKeys,
            // selected metric
            selectedMetricName,
            setSelectedMetricName,
            selectedSeriesGroup,
            // event: highlighted serie, compute plan or organization
            highlightedSerie,
            setHighlightedSerie,
            highlightedComputePlanKey,
            setHighlightedComputePlanKey,
            highlightedOrganizationId,
            setHighlightedOrganizationId,
            // event: hovered/selected rank
            hoveredRank,
            setHoveredRank,
            selectedRank,
            setSelectedRank,
            rankData,
            // for JPEG export
            perfChartRef,
            // test task drawer
            drawerTestTaskKey,
            setDrawerTestTaskKey,
            // indexes
            getComputePlanIndex,
            getOrganizationIndex,
            getSerieIndex,
        },
    };
};

export default usePerfBrowser;
