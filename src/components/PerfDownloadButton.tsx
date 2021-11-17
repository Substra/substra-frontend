import { RefObject } from 'react';

import {
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import { toJpeg } from 'html-to-image';
import { ICsvProps, toCsv } from 'react-csv-downloader';
import { RiDownloadLine } from 'react-icons/ri';

import { csvPerfChartColumns } from '@/modules/computePlans/ComputePlansConstants';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { SerieT } from '@/modules/series/SeriesTypes';

import { downloadBlob } from '@/libs/request';

interface PerfDownloadButtonProps {
    series: SerieT[];
    downloadRef: RefObject<HTMLDivElement>;
    computePlan: ComputePlanT | null;
}

const PerfDownloadButton = ({
    series,
    downloadRef,
    computePlan,
}: PerfDownloadButtonProps): JSX.Element => {
    const getCsvData = (): ICsvProps['datas'] => {
        const data = [];
        for (const serie of series) {
            for (const point of serie.points) {
                data.push({
                    computePlanTag: computePlan?.tag || '',
                    computePlanMetadata: JSON.stringify(
                        computePlan?.metadata || {}
                    ),
                    worker: serie.worker,
                    metricKey: serie.metricKey,
                    datasetKey: serie.datasetKey,
                    metricName: serie.metricName,
                    testtupleKey: point.testTaskKey,
                    testtupleRank: point.rank.toString(),
                    perfValue: point.perf?.toString(),
                });
            }
        }
        return data;
    };

    const onDownloadCsv = async () => {
        // This code is adapted from the handleClick function of CsvDownloader
        // https://github.com/dolezel/react-csv-downloader/blob/master/src/index.tsx
        const csv = await toCsv({
            columns: csvPerfChartColumns,
            datas: getCsvData(),
        });

        const bomCode = '\ufeff';

        const blob = new Blob([`${bomCode}${csv}`], {
            type: 'text/csv;charset=utf-8',
        });
        downloadBlob(blob, `cp_${computePlan?.key}.csv`);
    };

    const onDownloadImage = () => {
        if (downloadRef.current) {
            toJpeg(downloadRef.current, { backgroundColor: '#fff' }).then(
                (dataUrl) => {
                    const link = document.createElement('a');
                    link.download = computePlan
                        ? `cp_${computePlan.key}.jpeg`
                        : 'cp_comparison.jpeg';
                    link.href = dataUrl;
                    link.click();
                }
            );
        }
    };

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Download chart"
                icon={<Icon as={RiDownloadLine} />}
                variant="solid"
                colorScheme="gray"
                size="sm"
            />
            <MenuList zIndex="popover">
                <MenuItem onClick={onDownloadImage}>Download as Jpeg</MenuItem>
                {computePlan && (
                    <MenuItem onClick={onDownloadCsv}>Download as CSV</MenuItem>
                )}
            </MenuList>
        </Menu>
    );
};

export default PerfDownloadButton;
