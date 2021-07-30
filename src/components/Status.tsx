import styled from '@emotion/styled';
import { RiCheckLine, RiCloseLine } from 'react-icons/ri';

import { TupleStatus } from '@/modules/tasks/TuplesTypes';

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
        case TupleStatus.canceled:
            icon = <RiCloseLine color={Colors.veryLightContent} />;
            type = Colors.veryLightContent;
            break;
        case TupleStatus.waiting:
        case TupleStatus.todo:
            icon = <Spinner color={Colors.running} />;
            type = Colors.running;
            break;
        case TupleStatus.doing:
            icon = <Spinner color={Colors.success} />;
            type = Colors.success;
            break;
        case TupleStatus.failed:
            icon = <RiCloseLine color={Colors.error} />;
            type = Colors.error;
            break;
        case TupleStatus.done:
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
