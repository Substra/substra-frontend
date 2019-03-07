/* global Blob */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import mime from 'mime-types';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {ghcolors} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {saveAs} from 'file-saver';
import {ice, iceBlue} from '../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
import {monospaceFamily, fontNormalMonospace} from '../../../../../../../assets/css/variables/font';
import DownloadSimple from '../../../svg/download-simple';
import IconButton from '../../iconButton';

const Wrapper = styled('div')`
    border: 1px solid ${ice};
    border-radius: 3px;
`;

const Header = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${ice};
    background-color: ${iceBlue};
    min-height: 40px;
    font-family: ${monospaceFamily};
    font-size: ${fontNormalMonospace};
`;

const customStyle = {
    ...ghcolors,
    'pre[class*="language-"]': {
        ...ghcolors['pre[class*="language-"]'],
        border: 'none',
        margin: 0,
        padding: `${spacingSmall}`,
        fontFamily: monospaceFamily,
        fontSize: fontNormalMonospace,
    },
    'code[class*="language-"]': {
        ...ghcolors['code[class*="language-"]'],
        fontFamily: monospaceFamily,
        fontSize: fontNormalMonospace,
    },
};

const lineNumberStyle = {
    userSelect: 'none',
};

const FilenameWrapper = styled('div')`
    padding: ${spacingExtraSmall} ${spacingNormal};
`;

const ActionsWrapper = styled('div')`
    padding: ${spacingExtraSmall};
    align-self: top;
`;


class CodeSample extends React.Component {
    downloadCode = () => {
        const {codeString, filename} = this.props;
        const jsonBlob = new Blob([JSON.stringify(codeString)], {type: mime.lookup(filename)});
        saveAs(jsonBlob, filename);
    };

    render() {
        const {filename, language, codeString} = this.props;
        return (
            <Wrapper>
                <Header>
                    <FilenameWrapper>
                        {filename}
                    </FilenameWrapper>
                    <ActionsWrapper>
                        <IconButton
                            onClick={this.downloadCode}
                            title={`Download ${filename}`}
                        >
                            <DownloadSimple width={15} height={15} />
                        </IconButton>
                    </ActionsWrapper>
                </Header>
                <SyntaxHighlighter
                    language={language}
                    showLineNumbers
                    lineNumberStyle={lineNumberStyle}
                    style={customStyle}
                >
                    {codeString}
                </SyntaxHighlighter>
            </Wrapper>
        );
    }
}

CodeSample.propTypes = {
    codeString: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
};

export default CodeSample;
