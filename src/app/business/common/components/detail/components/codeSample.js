/* global Blob */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import mime from 'mime-types';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {ghcolors} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {saveAs} from 'file-saver';
import {DownloadSimple, Expand, Collapse} from '@substrafoundation/substra-ui';
import {ice, iceBlue} from '../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
import {monospaceFamily, fontNormalMonospace} from '../../../../../../../assets/css/variables/font';
import IconButton from '../../iconButton';

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
`;

const marginLeft = css`
    margin-left: ${spacingExtraSmall};
`;

class CodeSample extends Component {
    state = {
        collapsed: true,
    };

    downloadCode = (e) => {
        e.stopPropagation();
        const {codeString, filename} = this.props;
        const jsonBlob = new Blob([codeString], {type: mime.lookup(filename)});
        saveAs(jsonBlob, filename);
    };

    toggleCollapsed = (e) => {
        e.stopPropagation();
        this.setState(state => ({collapsed: !state.collapsed}));
    };

    render() {
        const {
            filename, language, codeString, collapsible, className,
        } = this.props;
        const {collapsed} = this.state;

        const Wrapper = styled('div')`
            border: 1px solid ${ice};
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            ${collapsible && collapsed && 'max-height: 150px;'}
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
            ${collapsible && 'cursor: pointer;'}
        `;

        return (
            <Wrapper className={className}>
                <Header onClick={this.toggleCollapsed}>
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
                        {collapsible && (
                            <IconButton
                                className={marginLeft}
                                onClick={this.toggleCollapsed}
                                title={collapsed ? 'Expand' : 'Collapse'}
                            >
                                {collapsed && <Expand width={15} height={15} />}
                                {!collapsed && <Collapse width={15} height={15} />}
                            </IconButton>

                        )}
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
    collapsible: PropTypes.bool,
    className: PropTypes.string,
};

CodeSample.defaultProps = {
    collapsible: false,
    className: '',
};

export default CodeSample;
