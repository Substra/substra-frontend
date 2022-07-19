import 'github-markdown-css/github-markdown-light.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Box, Heading } from '@chakra-ui/react';

type MarkdownSectionProps = {
    source: string;
};

const MarkdownSection = ({ source }: MarkdownSectionProps): JSX.Element => (
    <Box width="100%" className="markdown-body">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={source}
            components={{
                h1: ({ ...props }) => (
                    <Heading as="h1" fontSize="32px" {...props} />
                ),
                h2: ({ ...props }) => <Heading fontSize="20px" {...props} />,
            }}
        />
    </Box>
);

export default MarkdownSection;
