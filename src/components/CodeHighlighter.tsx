import SyntaxHighlighter, {
    SyntaxHighlighterProps,
} from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeHighlighterProps extends SyntaxHighlighterProps {
    code: string;
}

const CodeHighlighter = ({
    code,
    ...props
}: CodeHighlighterProps): JSX.Element => (
    <SyntaxHighlighter style={githubGist} showLineNumbers={true} {...props}>
        {code}
    </SyntaxHighlighter>
);
export default CodeHighlighter;
