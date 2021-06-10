import { Colors } from '@/assets/theme';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface SkeletonProps {
    width: number;
    height: number;
}

const bgShine = (width: number) => keyframes`
        0% {
            background-position: -120px;
        }

        40%,
        100% {
            background-position: ${width + 200}px;
        }
`;

const Skeleton = styled.div<SkeletonProps>`
    width: ${({ width }) => width}px;
    height: ${({ height }) => (height ? height : 10)}px;
    background-color: ${Colors.border};
    border-radius: 2px;
    background-image: linear-gradient(
        120deg,
        ${Colors.border} 0px,
        ${Colors.background} 40px,
        ${Colors.background} 60px,
        ${Colors.border} 100px
    );
    background-size: 100px;
    background-repeat: no-repeat;
    animation: ${({ width }) => bgShine(width)} 3s infinite ease-in;
`;

export default Skeleton;
