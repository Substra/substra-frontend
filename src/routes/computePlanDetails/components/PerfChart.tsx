/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment, RefObject, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { toJpeg } from 'html-to-image';
import CsvDownloader, { ICsvProps } from 'react-csv-downloader';
import { RiDownloadLine } from 'react-icons/ri';

import { csvPerfChartColumns } from '@/modules/computePlans/ComputePlansConstants';
import { SerieT } from '@/modules/series/SeriesTypes';

import { useAppSelector } from '@/hooks';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { PATHS } from '@/routes';

import BasePerfChart from '@/components/PerfChart';
import PerfChartLegend from '@/components/PerfChartLegend';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: ${Spaces.small};
    margin: 0 -${Spaces.small};
`;

const Header = styled.div`
    display: flex;
    align-items: baseline;
    width: 100%;
    margin: 0 -${Spaces.small} ${Spaces.large};
`;
const Title = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: bold;
    color: ${Colors.content};
    margin: 0 ${Spaces.small};
`;
interface DownloadButtonProps {
    active: boolean;
}
interface DownloadItemProps {
    disabled: boolean;
}

const DownloadButton = styled.button<DownloadButtonProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${Colors.primary};
    height: 25px;
    width: 25px;
    background: ${({ active }) => (active ? Colors.darkerBackground : 'none')};
    border: 1px solid ${Colors.border};
    border-radius: 50%;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    text-align: center;
    margin: 0 ${Spaces.small};
    cursor: pointer;

    &:hover {
        background-color: ${Colors.darkerBackground};
    }
`;

const DownloadMenu = styled.ul`
    position: absolute;
    top: 30px;
    left: 0;
    width: 200px;
    border-radius: ${Spaces.medium};
    background-color: white;
    box-shadow: 0 0 8px ${Colors.border};
    z-index: 10;
    transition: all 0.1s linear;
`;

const invisibleContainer = css`
    opacity: 0;
    top: 26px;
    pointer-events: none;
`;

const DownloadItem = styled.li<DownloadItemProps>`
    padding: ${Spaces.medium};
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'inherit')};

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

interface PerfChartProps {
    series: SerieT[];
    displayAverage: boolean;
    displayMultiChart: boolean;
}
const PerfChart = ({
    series,
    displayAverage,
    displayMultiChart,
}: PerfChartProps): JSX.Element => {
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const downloadRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);

    const downloadImage = (ref: HTMLElement | null) => {
        if (ref === null) {
            return;
        }

        toJpeg(ref, { backgroundColor: '#fff' }).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `cp_${key}.jpeg`;
            link.href = dataUrl;
            link.click();
        });
    };

    const csvDatas: ICsvProps['datas'] = useMemo(() => {
        const datas = [];
        for (const serie of series) {
            for (const point of serie.points) {
                datas.push({
                    computePlanTag: computePlan?.tag || '',
                    computePlanMetadata: JSON.stringify(
                        computePlan?.metadata || {}
                    ),
                    worker: serie.worker,
                    objectiveKey: serie.metricKey,
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

    const closeDownloadMenu = () => {
        setShowDownloadMenu(false);
        document.removeEventListener('click', closeDownloadMenu);
    };

    const toggleDownloadMenu = (e: React.MouseEvent) => {
        if (showDownloadMenu) {
            closeDownloadMenu();
            return;
        }
        setShowDownloadMenu(true);
        e.stopPropagation();
        document.addEventListener('click', closeDownloadMenu);
    };

    const perfChartTitle = useMemo(() => {
        const metricName = series[0].metricName;
        const title = `${metricName
            .charAt(0)
            .toUpperCase()}${metricName.substring(1)}`;

        return displayMultiChart
            ? `${title} - ${series[0].worker}`
            : `${title} - All nodes`;
    }, [series]);

    return (
        <Fragment>
            <Header>
                <Title>{perfChartTitle}</Title>
                <DownloadButton
                    active={showDownloadMenu}
                    onClick={toggleDownloadMenu}
                >
                    <RiDownloadLine />
                    <DownloadMenu
                        css={[!showDownloadMenu && invisibleContainer]}
                    >
                        <DownloadItem
                            disabled={!downloadRef.current}
                            onClick={(e) => {
                                downloadImage(downloadRef.current);
                                toggleDownloadMenu(e);
                            }}
                        >
                            Download As Jpeg
                        </DownloadItem>
                        <DownloadItem
                            disabled={!csvDatas}
                            onClick={toggleDownloadMenu}
                        >
                            <CsvDownloader
                                filename={`cp_${key}`}
                                datas={csvDatas}
                                columns={csvPerfChartColumns}
                            >
                                Download As CSV
                            </CsvDownloader>
                        </DownloadItem>
                    </DownloadMenu>
                </DownloadButton>
            </Header>
            <Container ref={downloadRef}>
                <BasePerfChart
                    series={series}
                    displayAverage={displayAverage}
                    getSerieLabel={(serie) => serie.id.toString()}
                    zoom={true}
                    tooltip={true}
                />
                <PerfChartLegend series={series} />
            </Container>
        </Fragment>
    );
};

export default PerfChart;
