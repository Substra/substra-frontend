import { Tag, TagLabel, TagLeftIcon, TagProps, Text } from '@chakra-ui/react';

import { getStatusLabel, getStatusStyle } from '@/libs/status';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

type StatusProps = {
    status: ComputePlanStatus | TupleStatus;
    size: TagProps['size'];
    variant?: TagProps['variant'];
    withIcon?: boolean;
    count?: number;
};

const Status = ({
    status,
    size,
    variant,
    withIcon,
    count,
}: StatusProps): JSX.Element => {
    const {
        icon,
        tagColor,
        tagBackgroundColor,
        tagSolidColor,
        tagSolidBackgroundColor,
    } = getStatusStyle(status);
    const label = getStatusLabel(status);
    const color = variant === 'solid' ? tagSolidColor : tagColor;
    const backgroundColor =
        variant === 'solid' ? tagSolidBackgroundColor : tagBackgroundColor;

    return (
        <Tag
            size={size}
            color={color}
            backgroundColor={backgroundColor}
            variant={variant}
        >
            {withIcon !== false && <TagLeftIcon as={icon} marginRight={1} />}
            <TagLabel>
                <Text fontWeight="semibold" as="span">
                    {label}
                </Text>
                {count !== undefined && ` • ${count}`}
            </TagLabel>
        </Tag>
    );
};

export default Status;
