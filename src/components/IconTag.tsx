import { Icon, Tag } from '@chakra-ui/react';

export interface IconTagProps {
    icon: React.ElementType;
    backgroundColor: string;
    fill: string;
}
const IconTag = ({
    icon,
    backgroundColor,
    fill,
}: IconTagProps): JSX.Element => (
    <Tag
        backgroundColor={backgroundColor}
        width="21px"
        height="21px"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        padding="0"
    >
        <Icon as={icon} fill={fill} />
    </Tag>
);
export default IconTag;
