import SyntaxHighlighter, {
    SyntaxHighlighterProps,
} from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeHighlighter = (props: SyntaxHighlighterProps): JSX.Element => (
    <SyntaxHighlighter style={githubGist} showLineNumbers={true} {...props} />
);
export default CodeHighlighter;
