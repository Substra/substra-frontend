import React from 'react';
import {css} from 'react-emotion';

import {Snackbar, SnackbarContent} from '@material-ui/core';

import uuidv4 from 'uuid/v4';
import {
    Base, verticalBar, anchorOrigin, ClipboardContent, middle, snackbarContent,
} from '../../../common/components/base';

import Check from '../../../common/svg/check';
import {tealish} from '../../../../../../assets/css/variables';


export default class ModelBase extends Base {
    filterUp = (o) => {
        const {setSearchState, selectedItem, model} = this.props;

        const newSelectedItem = [
            ...selectedItem,
            // This is the -OR- case
            // ...(selectedItem.length && !last(selectedItem).isLogic ? [{
            //     parent: '-OR-',
            //     isLogic: true,
            //     uuid: uuidv4(),
            // }] : []),
            {
                parent: model,
                child: `hash:${o}`,
                isLogic: false,
                uuid: uuidv4(),
            }];

        setSearchState({
            isParent: true,
            inputValue: '',
            selectedItem: newSelectedItem,
            item: o,
            toUpdate: true,
        });
    };

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

    chartOver = (key) => {
        this.setState(state => ({
            ...state,
            hoverItem: key,
        }));
    };

    chartOut = () => {
        this.setState(state => ({
            ...state,
            hoverItem: null,
        }));
    };


    hover = (item) => {
        const {chart} = this.props;

        chart.series.forEach((serie) => {
            const point = serie.data.find(x => x.key === item.key);
            if (point) {
                point.setState('hover');
            }
        });
    };

    out = (item) => {
        const {chart} = this.props;
        chart.series.forEach(x => x.data.forEach(x => x.setState('')));
    };

    render() {
        const {
            model, actions, download,
            List, Detail,
        } = this.props;

        const {clipboard: {open, text, inputValue}, hoverItem} = this.state;

        return (
            <div
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
                    hover={this.hover}
                    out={this.out}
                    download={download}
                    hoverItem={hoverItem}
                />
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
                    over={this.chartOver}
                    out={this.chartOut}
                />
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
                                <Check color={tealish} className={middle} />
                                <ClipboardContent>
                                    <input disabled value={inputValue} />
                                    <p>
                                        {text}
                                    </p>
                                </ClipboardContent>
                            </div>)
                        }
                    />
                </Snackbar>
            </div>
        );
    }
}
