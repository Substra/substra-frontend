import React, {Fragment} from 'react';
import {css} from 'react-emotion';

import {Snackbar, SnackbarContent} from '@material-ui/core';

import {Base, verticalBar, anchorOrigin, ClipboardContent, middle, snackbarContent} from '../../../common/components/base';

import Check from '../../../common/svg/check';
import {tealish} from '../../../../../../assets/css/variables';


export default class ModelLayout extends Base {
    list = () => {
        const {width: {list: {value, unit}}} = this.state;
        return css`
            ${middle};
            width: ${`${value}${unit}`};
            overflow-x: auto;
        `;
    };

    detail = () => {
        const {width: {detail: {value, unit}}} = this.state;
        return css`
            ${middle};
            width: ${`${value}${unit}`};
            overflow-x: auto;
        `;
    };

    render() {
        const {
            model, actions, download,
            List, Detail,
        } = this.props;

        const {clipboard: {open, text, inputValue}} = this.state;

        return (<div
            ref={this.contentRef}
            onMouseMove={this.move}
            onMouseUp={this.mouseUp}
            className={this.layout()}
            >
            <List
                className={this.list()}
                model={model}
                actions={actions}
                filterUp={this.filterUp}
                downloadFile={this.downloadFile}
                addNotification={this.addNotification}
                download={download}
            />
            <Fragment>
                <div
                    onMouseDown={this.mouseDown}
                    className={verticalBar}
                />
                <Detail
                    className={this.detail()}
                    model={model}
                    actions={actions}
                    filterUp={this.filterUp}
                    downloadFile={this.downloadFile}
                    addNotification={this.addNotification}
                />
            </Fragment>
            <Snackbar
                anchorOrigin={anchorOrigin}
                open={open}
                onClose={this.handleClose}
                autoHideDuration={2000}
            >
                <SnackbarContent
                    className={snackbarContent}
                    message={(
                        <div>
                            <Check color={tealish} className={middle}/>
                            <ClipboardContent>
                                <input disabled value={inputValue}/>
                                <p>
                                    {text}
                                </p>
                            </ClipboardContent>
                        </div>)
                    }
                />
            </Snackbar>
        </div>);
    }
}
