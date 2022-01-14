import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Code = ({ code }: { code: string }): JSX.Element => (
    <SyntaxHighlighter
        language="python"
        style={githubGist}
        showLineNumbers={true}
    >
        {code}
    </SyntaxHighlighter>
);
export default Code;
