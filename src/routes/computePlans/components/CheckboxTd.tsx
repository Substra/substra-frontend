import { Box, Td } from '@chakra-ui/react';

const CheckboxTd = ({
    firstCol,
    children,
}: {
    firstCol?: boolean;
    children: React.ReactNode;
}): JSX.Element => (
    <Td
        position="relative"
        // width and padding are here to compensate for the label being positioned with absolute
        minWidth={firstCol ? '50px' : '36px'}
        paddingLeft={firstCol ? '6' : '2.5'}
        paddingRight="2.5"
    >
        <Box
            as="label"
            position="absolute"
            left="0"
            right="0"
            bottom="0"
            top="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingLeft={firstCol ? '6' : '2.5'}
            paddingRight="2.5"
            paddingTop="3px" // Visually center the checkbox
            // @ts-expect-error Box as label expects a weird type for onClick
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </Box>
    </Td>
);
export default CheckboxTd;
