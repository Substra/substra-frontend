import {
    IconButton,
    IconButtonProps,
    Tooltip,
    useClipboard,
} from '@chakra-ui/react';
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri';

interface CopyIconButtonProps {
    value: string;
    label: string;
    variant?: IconButtonProps['variant'];
}
const CopyIconButton = ({
    value,
    label,
    variant = 'solid',
}: CopyIconButtonProps): JSX.Element => {
    const { hasCopied, onCopy } = useClipboard(value);

    return (
        <Tooltip
            label={label}
            fontSize="xs"
            hasArrow={true}
            placement="top"
            borderRadius="base"
        >
            <IconButton
                aria-label={label}
                variant={variant}
                size="sm"
                color="gray.500"
                icon={hasCopied ? <RiCheckLine /> : <RiFileCopyLine />}
                onClick={onCopy}
            />
        </Tooltip>
    );
};
export default CopyIconButton;
