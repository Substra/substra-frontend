import styled from '@emotion/styled';
import 'github-markdown-css/github-markdown.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Colors, Fonts } from '@/assets/theme';

interface MarkdownSectionProps {
    source: string;
}

const Title = styled.h1`
    font-size: ${Fonts.sizes.h1};
    font-weight: ${Fonts.weights.heavy};
    color: ${Colors.content};
`;

const Subtitle = styled.h2`
    font-size: ${Fonts.sizes.h2};
    font-weight: ${Fonts.weights.normal};
    color: ${Colors.content};
`;

const MarkdownSection = ({ source }: MarkdownSectionProps): JSX.Element => (
    <div className="markdown-body">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={source}
            components={{
                h1: ({ ...props }) => <Title {...props} />,
                h2: ({ ...props }) => <Subtitle {...props} />,
            }}
        />
    </div>
);

export default MarkdownSection;
