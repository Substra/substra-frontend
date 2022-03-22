import { Flex, Text, TextProps } from '@chakra-ui/react';

interface TextWithMiddleEllipsisProps extends TextProps {
    text: string;
    charsAfterEllipsis: number;
}
const TextWithMiddleEllipsis = ({
    text,
    charsAfterEllipsis,
    width,
    ...props
}: TextWithMiddleEllipsisProps) => {
    const before = text.slice(0, text.length - charsAfterEllipsis);
    const after = text.slice(text.length - charsAfterEllipsis);
    return (
        <Flex width={width} overflow="hidden" whiteSpace="nowrap">
            <Text
                as="span"
                overflow="hidden"
                textOverflow="ellipsis"
                {...props}
            >
                {before}
            </Text>
            <Text
                as="span"
                flexShrink="0"
                overflow="hidden"
                textOverflow="ellipsis"
                {...props}
            >
                {after}
            </Text>
        </Flex>
    );
};
export default TextWithMiddleEllipsis;
