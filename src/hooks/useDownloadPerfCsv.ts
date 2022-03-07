import { useContext } from 'react';

import { toCsv } from 'react-csv-downloader';

import { getMelloddyName } from '@/modules/computePlans/ComputePlanUtils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { SerieT } from '@/modules/series/SeriesTypes';

import { downloadBlob } from '@/libs/request';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

enum CSV_COLUMN_ID {
    computePlanKey = 'computePlanKey',
    computePlanTag = 'computePlanTag',
    computePlanStatus = 'computePlanStatus',
    computePlanStartDate = 'computePlanStartDate',
    computePlanEndDate = 'computePlanEndDate',
    computePlanMetadata = 'computePlanMetadata',
    worker = 'worker',
    testtupleKey = 'testtupleKey',
    metricName = 'metricName',
    lineId = 'lineId',
    testtupleRank = 'testtupleRank',
    perf = 'perf',
}

type Data = Record<CSV_COLUMN_ID, string>;
type Datas = Data[];

const CSV_COLUMNS = [
    { displayName: 'Compute plan key', id: CSV_COLUMN_ID.computePlanKey },
    ...(MELLODDY
        ? [
              {
                  displayName: 'Compute plan name',
                  id: 'computePlanName',
              },
          ]
        : []),
    { displayName: 'Compute plan tag', id: CSV_COLUMN_ID.computePlanTag },
    { displayName: 'Compute plan status', id: CSV_COLUMN_ID.computePlanStatus },
    {
        displayName: 'Compute plan start date',
        id: CSV_COLUMN_ID.computePlanStartDate,
    },
    {
        displayName: 'Compute plan end date',
        id: CSV_COLUMN_ID.computePlanEndDate,
    },
    {
        displayName: 'Compute plan Metadata',
        id: CSV_COLUMN_ID.computePlanMetadata,
    },
    { displayName: 'Worker', id: CSV_COLUMN_ID.worker },
    { displayName: 'Testtuple key', id: CSV_COLUMN_ID.testtupleKey },
    { displayName: 'Metric name', id: CSV_COLUMN_ID.metricName },
    { displayName: 'Line ID', id: CSV_COLUMN_ID.lineId },
    { displayName: 'Testtuple rank', id: CSV_COLUMN_ID.testtupleRank },
    { displayName: 'Performance', id: CSV_COLUMN_ID.perf },
];

const escape = (s: string): string => s.replace(/"/g, '""');

const getDatas = (
    series: SerieT[],
    computePlans: ComputePlanT[],
    getSerieIndex: (computePlanKey: string, serieId: string) => string
): Datas => {
    const datas: Datas = [];
    for (const serie of series) {
        for (const point of serie.points) {
            const computePlan = computePlans.find(
                (cp) => cp.key === serie.computePlanKey
            );
            datas.push({
                computePlanKey: escape(computePlan?.key || 'NA'),
                ...(MELLODDY
                    ? {
                          computePlanName: computePlan
                              ? getMelloddyName(computePlan)
                              : 'NA',
                      }
                    : {}),
                computePlanTag: escape(computePlan?.tag || 'NA'),
                computePlanStatus: escape(computePlan?.status || 'NA'),
                computePlanStartDate: escape(computePlan?.start_date || 'NA'),
                computePlanEndDate: escape(computePlan?.end_date || 'NA'),
                computePlanMetadata: escape(
                    JSON.stringify(computePlan?.metadata || {})
                ),
                worker: escape(serie.worker),
                testtupleKey: escape(point.testTaskKey || 'NA'),
                metricName: escape(serie.metricName),
                lineId: escape(
                    `#${getSerieIndex(serie.computePlanKey, serie.id)}`
                ),
                testtupleRank: escape(point.rank.toString()),
                perf: escape(
                    point.perf === null ? 'NA' : point.perf.toString()
                ),
            });
        }
    }
    return datas;
};

const compareDatas = (a: Data, b: Data) => {
    // Order datas by:
    //   1. compute plan key
    //   2. metric name
    //   3. worker
    //   4. rank
    if (a.computePlanKey < b.computePlanKey) {
        return -1;
    } else if (a.computePlanKey > b.computePlanKey) {
        return 1;
    }

    if (a.metricName < b.metricName) {
        return -1;
    } else if (a.metricName > b.metricName) {
        return 1;
    }

    if (a.worker < b.worker) {
        return -1;
    } else if (a.worker > b.worker) {
        return 1;
    }

    const rankA = parseInt(a.testtupleRank);
    const rankB = parseInt(b.testtupleRank);
    if (rankA < rankB) {
        return -1;
    } else if (rankA > rankB) {
        return 1;
    }

    return 0;
};

const useDownloadPerfCsv = (seriesGroups: SerieT[][]) => {
    const { computePlans, getSerieIndex } = useContext(PerfBrowserContext);

    const downloadPerfCsv = async () => {
        // This code is adapted from the handleClick function of CsvDownloader
        // https://github.com/dolezel/react-csv-downloader/blob/master/src/index.tsx

        // extract data from all groups
        const datas: Datas = seriesGroups.reduce(
            (allDatas: Datas, series: SerieT[]) => [
                ...allDatas,
                ...getDatas(series, computePlans, getSerieIndex),
            ],
            []
        );

        datas.sort(compareDatas);

        const csv = await toCsv({
            columns: CSV_COLUMNS,
            wrapColumnChar: '"',
            datas,
        });

        const bomCode = '\ufeff';

        const blob = new Blob([`${bomCode}${csv}`], {
            type: 'text/csv;charset=utf-8',
        });
        downloadBlob(blob, `cp_${computePlans[0].key}.csv`);
    };

    return downloadPerfCsv;
};
export default useDownloadPerfCsv;
