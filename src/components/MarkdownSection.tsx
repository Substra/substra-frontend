import { Heading } from '@chakra-ui/react';
import 'github-markdown-css/github-markdown-light.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownSectionProps {
    source: string;
}

const MarkdownSection = ({ source }: MarkdownSectionProps): JSX.Element => (
    <div className="markdown-body">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={source}
            components={{
                h1: () => <Heading as="h1" fontSize="32px" />,
                h2: () => <Heading fontSize="20px" />,
            }}
        />
    </div>
);

export default MarkdownSection;
