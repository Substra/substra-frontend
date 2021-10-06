import { IconButton } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { RiFullscreenFill } from 'react-icons/ri';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    width: 350px;
    height: 300px;
    border-radius: 8px;
    border: 1px solid ${Colors.border};
    margin: ${Spaces.large};
    padding: ${Spaces.large} ${Spaces.medium};

    &:hover {
        border-color: #319795;
    }
`;

const Title = styled.h2`
    font-size: ${Fonts.sizes.h3};
    font-weight: ${Fonts.weights.heavy};
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

interface PerformanceCardProps {
    title: string;
    children: React.ReactNode;
    onClickFullScreen: () => void;
}

const PerformanceCard = ({
    title,
    children,
    onClickFullScreen,
}: PerformanceCardProps): JSX.Element => {
    return (
        <Container>
            {children}
            <Row>
                <Title>{title}</Title>
                <IconButton
                    aria-label="Toggle Fullscreen Mode"
                    icon={<RiFullscreenFill />}
                    onClick={onClickFullScreen}
                />
            </Row>
        </Container>
    );
};

export default PerformanceCard;
