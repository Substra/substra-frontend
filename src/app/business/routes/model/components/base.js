import React from 'react';
import {css} from 'react-emotion';

import {Snackbar, SnackbarContent} from '@material-ui/core';

import uuidv4 from 'uuid/v4';
import {
    Base, verticalBar, anchorOrigin, ClipboardContent, middle, snackbarContent,
} from '../../../common/components/base';

import Check from '../../../common/svg/check';
import {tealish} from '../../../../../../assets/css/variables';
import {hover} from '../selector';


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


    hover = (item) => {
        const {chart, challengeFilters, data} = this.props;

        if (challengeFilters.length && chart && chart.series) {
            chart.series.forEach((serie) => {
                if (serie.data) {
                    const point = serie.data.find(x => x.key === item.key);
                    if (point) {
                        point.series.group.attr({zIndex: data.perf.length + 1});
                        point.series.markerGroup.attr({zIndex: data.perf.length + 1});
                        point.update({
                            marker: {fillColor: '#fff', lineColor: hover, lineWidth: 2},
                        });
                    }
                }
            });
        }
    };

    out = (item) => {
        const {challengeFilters, chart, selected} = this.props;

        if (challengeFilters.length && chart && chart.series) {
            chart.series.forEach((serie) => {
                if (serie.data) {
                    const point = serie.data.find(x => x.key !== selected && x.key === item.key);
                    if (point) {
                        point.series.group.attr({zIndex: +point.series.name.split('-')[1]});
                        point.series.markerGroup.attr({zIndex: +point.series.name.split('-')[1]});
                        point.update({
                            marker: {fillColor: point.series.userOptions.color, lineWidth: 0},
                        });
                    }
                }
            });
        }
    };

    render() {
        const {
            model, actions, download,
            List, Detail,
        } = this.props;

        const {clipboard: {open, text, inputValue}} = this.state;

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
