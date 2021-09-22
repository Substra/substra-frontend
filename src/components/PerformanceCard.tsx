import styled from '@emotion/styled';

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
}

const PerformanceCard = ({
    title,
    children,
}: PerformanceCardProps): JSX.Element => {
    return (
        <Container>
            {children}
            <Row>
                <Title>{title}</Title>
            </Row>
        </Container>
    );
};

export default PerformanceCard;
