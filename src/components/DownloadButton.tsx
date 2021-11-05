import { RefObject, useMemo, useState } from 'react';

import { Box, HStack, IconButton } from '@chakra-ui/react';
import { toJpeg } from 'html-to-image';
import CsvDownloader, { ICsvProps } from 'react-csv-downloader';
import { RiDownloadLine } from 'react-icons/ri';

import { csvPerfChartColumns } from '@/modules/computePlans/ComputePlansConstants';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { SerieT } from '@/modules/series/SeriesTypes';

interface DownloadButtonProps {
    series: SerieT[];
    downloadRef: RefObject<HTMLDivElement>;
    computePlan?: ComputePlanT;
}

const DownloadButton = ({
    series,
    downloadRef,
    computePlan,
}: DownloadButtonProps): JSX.Element => {
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    const csvDatas: ICsvProps['datas'] = useMemo(() => {
        const datas = [];
        for (const serie of series) {
            for (const point of serie.points) {
                datas.push({
                    computePlanTag: (computePlan && computePlan?.tag) || '',
                    computePlanMetadata: JSON.stringify(
                        (computePlan && computePlan?.metadata) || {}
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
        return datas;
    }, [series]);

    const toggleDownloadMenu = () => {
        setShowDownloadMenu(!showDownloadMenu);
    };

    const downloadImage = (ref: HTMLElement | null) => {
        if (ref === null) {
            return;
        }

        toJpeg(ref, { backgroundColor: '#fff' }).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = computePlan
                ? `cp_${computePlan.key}.jpeg`
                : 'cp_comparison.jpeg';
            link.href = dataUrl;
            link.click();
        });
        setShowDownloadMenu(false);
    };

    return (
        <HStack position="relative" _hover={{ zIndex: 1 }}>
            <IconButton
                marginLeft={2}
                aria-label="Toggle Fullscreen Mode"
                icon={<RiDownloadLine />}
                onClick={toggleDownloadMenu}
                size="sm"
            />
            {showDownloadMenu && (
                <Box
                    position="absolute"
                    backgroundColor="white"
                    top="45px"
                    paddingY={1}
                    right="0px"
                    width="175px"
                    boxShadow="md"
                    rounded="md"
                >
                    <Box
                        onClick={() => {
                            downloadImage(downloadRef.current);
                        }}
                        paddingX={4}
                        paddingY={2}
                        _hover={{
                            backgroundColor: 'var(--chakra-colors-teal-50)',
                        }}
                        cursor="pointer"
                    >
                        Download As Jpeg
                    </Box>
                    {computePlan && (
                        <Box
                            disabled={!csvDatas}
                            paddingX={4}
                            paddingY={2}
                            _hover={{
                                backgroundColor: 'var(--chakra-colors-teal-50)',
                            }}
                        >
                            <CsvDownloader
                                filename={`cp_${computePlan.key}`}
                                datas={csvDatas}
                                columns={csvPerfChartColumns}
                            >
                                Download As CSV
                            </CsvDownloader>
                        </Box>
                    )}
                </Box>
            )}
        </HStack>
    );
};

export default DownloadButton;
