import { IconButton } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { RiFullscreenExitFill } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import PerfChart from '@/components/PerfChart';

import { Spaces } from '@/assets/theme';

const Container = styled.div`
    width: 100%;
    height: 100%;
`;

const PerfChartContainer = styled.div`
    margin-top: ${Spaces.large};
    width: calc(100vw - 300px);
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`;

const Title = styled.h2`
    font-weight: 500;
`;

interface CompareFullScreenProps {
    onClickClose: () => void;
    series: SerieT[];
}

const CompareFullScreen = ({
    onClickClose,
    series,
}: CompareFullScreenProps): JSX.Element => {
    return (
        <Container>
            <Header>
                <Title>{series[0].metricName}</Title>
                <IconButton
                    aria-label="Toggle Fullscreen Mode"
                    icon={<RiFullscreenExitFill />}
                    onClick={onClickClose}
                />
            </Header>
            <PerfChartContainer>
                <PerfChart
                    series={series}
                    getSerieLabel={(serie) => serie.computePlanKey}
                    zoom
                    tooltip
                />
            </PerfChartContainer>
        </Container>
    );
};

export default CompareFullScreen;
