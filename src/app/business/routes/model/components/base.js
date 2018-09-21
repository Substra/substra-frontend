import React, {Fragment, Component} from 'react';
import {css} from 'react-emotion';
import {verticalBar} from '../../../common/components/base';

import List from './list';
import Detail from './detail';


const middle = css`
    display: inline-block;
    vertical-align: top;
`;

export default class Base extends Component {
    list = () => {
        const {width: {list: {value, unit}}} = this.props;
        return css`
            ${middle};
            width: ${`${value}${unit}`};
            overflow-x: auto;
        `;
    };

    detail = () => {
        const {width: {detail: {value, unit}}} = this.props;
        return css`
            ${middle};
            width: ${`${value}${unit}`};
            overflow-x: auto;
        `;
    };

    render() {
        const {model, actions, download, contentRef, move, mouseUp, content, filterUp, downloadFile, addNotification, mouseDown} = this.props;

        return <div
            ref={contentRef}
            onMouseMove={move}
            onMouseUp={mouseUp}
            className={content()}>
            <List
                className={this.list()}
                model={model}
                actions={actions}
                filterUp={filterUp}
                downloadFile={downloadFile}
                addNotification={addNotification}
                download={download}
            />
            <Fragment>
                <div
                    onMouseDown={mouseDown}
                    className={verticalBar}
                />
                <Detail
                    className={this.detail()}
                    model={model}
                    actions={actions}
                    filterUp={filterUp}
                    downloadFile={downloadFile}
                    addNotification={addNotification}
                />
            </Fragment>
        </div>;
    }
}
