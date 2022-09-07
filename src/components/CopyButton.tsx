import { Button, useClipboard } from '@chakra-ui/react';

type CopyButtonProps = {
    value: string;
};

const CopyButton = ({ value }: CopyButtonProps): JSX.Element => {
    const { hasCopied, onCopy } = useClipboard(value);

    return (
        <Button
            variant="ghost"
            color="primary.500"
            textTransform="uppercase"
            size="xs"
            onClick={onCopy}
        >
            {hasCopied ? 'Copied' : 'Copy'}
        </Button>
    );
};

export default CopyButton;
