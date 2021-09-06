import styled from '@emotion/styled';
import { RiCheckLine, RiCloseLine } from 'react-icons/ri';

import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import { getStatusLabel } from '@/libs/status';

import Spinner from '@/components/Spinner';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const StatusContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface StatusTextProps {
    type: string;
}
const StatusText = styled.span<StatusTextProps>`
    font-size: ${Fonts.sizes.input};
    color: ${({ type }) => (type ? type : '')};
`;

const StatusIcon = styled.div`
    margin-right: ${Spaces.small};
`;

interface StatusProps {
    status: ComputePlanStatus | TupleStatus;
}

const Status = ({ status }: StatusProps): JSX.Element => {
    let type = '';
    let icon: JSX.Element | null = null;

    switch (status) {
        case TupleStatus.canceled:
        case ComputePlanStatus.canceled:
            icon = <RiCloseLine color={Colors.veryLightContent} />;
            type = Colors.veryLightContent;
            break;
        case TupleStatus.waiting:
        case ComputePlanStatus.waiting:
        case TupleStatus.todo:
        case ComputePlanStatus.todo:
            icon = <Spinner color={Colors.running} />;
            type = Colors.running;
            break;
        case TupleStatus.doing:
        case ComputePlanStatus.doing:
            icon = <Spinner color={Colors.success} />;
            type = Colors.success;
            break;
        case TupleStatus.failed:
        case ComputePlanStatus.failed:
            icon = <RiCloseLine color={Colors.error} />;
            type = Colors.error;
            break;
        case TupleStatus.done:
        case ComputePlanStatus.done:
            icon = <RiCheckLine color={Colors.success} />;
            type = Colors.success;
            break;
        default:
            break;
    }

    return (
        <StatusContainer>
            <StatusIcon>{icon}</StatusIcon>
            <StatusText type={type}>{getStatusLabel(status)}</StatusText>
        </StatusContainer>
    );
};

export default Status;
