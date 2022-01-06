import {
    IconButton,
    IconButtonProps,
    Tooltip,
    useClipboard,
} from '@chakra-ui/react';
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri';

interface CopyIconButtonProps extends IconButtonProps {
    value: string;
}
const CopyIconButton = ({
    value,
    ...props
}: CopyIconButtonProps): JSX.Element => {
    const { hasCopied, onCopy } = useClipboard(value);

    return (
        <Tooltip
            label={props['aria-label']}
            fontSize="xs"
            hasArrow={true}
            placement="top"
        >
            <IconButton
                {...props}
                color="gray.500"
                icon={hasCopied ? <RiCheckLine /> : <RiFileCopyLine />}
                onClick={onCopy}
            />
        </Tooltip>
    );
};
export default CopyIconButton;
