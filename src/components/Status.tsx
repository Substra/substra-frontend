import styled from '@emotion/styled';
import { RiCheckLine, RiCloseLine } from 'react-icons/ri';

import { TaskStatus } from '@/modules/tasks/TasksTypes';

import Spinner from '@/components/Spinner';

import { Colors, Fonts, Spaces } from '@/assets/theme';

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
            icon = <Spinner color={Colors.running} />;
            type = Colors.running;
            break;
        case TaskStatus.doing:
            icon = <Spinner color={Colors.success} />;
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
