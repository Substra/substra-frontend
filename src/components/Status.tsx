/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { Colors, Fonts, Spaces } from '@/assets/theme';
import { TaskStatus } from '@/modules/tasks/TasksTypes';
import { RiCheckLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri';

interface StatusProps {
    status: string;
}

const StatusContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StatusText = styled.span<StatusProps>`
    font-size: ${Fonts.sizes.input};
    color: ${({ status }) => (status ? status : '')};
`;

const StatusIcon = styled.div`
    margin-right: ${Spaces.small};
`;

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const rotation = css`
    animation: ${rotate} 2s linear infinite;
`;

const Status = ({ status }: StatusProps): JSX.Element => {
    let type = '';
    let icon: JSX.Element | null = null;

    switch (status) {
        case TaskStatus.canceled:
            icon = <RiCloseLine color={Colors.veryLightContent} />;
            type = Colors.veryLightContent;
            break;
        case TaskStatus.waiting:
        case TaskStatus.todo:
            icon = <RiLoader4Line css={rotation} color={Colors.running} />;
            type = Colors.running;
            break;
        case TaskStatus.doing:
            icon = <RiLoader4Line css={rotation} color={Colors.success} />;
            type = Colors.success;
            break;
        case TaskStatus.failed:
            icon = <RiCloseLine color={Colors.error} />;
            type = Colors.error;
            break;
        case TaskStatus.done:
            icon = <RiCheckLine color={Colors.success} />;
            type = Colors.success;
            break;
        default:
            break;
    }

    return (
        <StatusContainer>
            <StatusIcon>{icon}</StatusIcon>
            <StatusText status={type}>{status.toUpperCase()}</StatusText>
        </StatusContainer>
    );
};

export default Status;
