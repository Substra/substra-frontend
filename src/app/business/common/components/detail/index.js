import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {noop} from 'lodash';

import {PanelWrapper, PanelTop, PanelContent} from '@substrafoundation/substra-ui';
import Title from './components/title';
import Section from './components/section';
import Metadata from './components/metadata';
import Actions from './components/actions';

class Detail extends Component {
    downloadFile = (e) => {
        const {downloadFile, item, logDownloadFromDetail} = this.props;

        downloadFile();
        logDownloadFromDetail(item.key);
    };

    addNotification = (key, text) => {
        const {addNotification, item, logCopyFromDetail} = this.props;

        addNotification(key, text);
        logCopyFromDetail(item.key);
    };

    filterUp = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {item, filterUp, logFilterFromDetail} = this.props;
        filterUp(o);
        logFilterFromDetail(item.key);
    };

    render() {
        const {
            item, model, children,
            Title, Metadata, Actions, Tabs,
        } = this.props;

        return (
            <PanelWrapper>
                <PanelTop className={css`justify-content: space-between;`}>
                    <Title item={item} />
                    <Actions
                        downloadFile={this.downloadFile}
                        filterUp={this.filterUp(item.name)}
                        model={model}
                        item={item}
                    />
                </PanelTop>
                {item && (
                <PanelContent>
                    <Section>
                        <Metadata
                            item={item}
                            addNotification={this.addNotification}
                            model={model}
                        />
                    </Section>
                    {Tabs && (
                        <Section>
                            <Tabs
                                downloadFile={this.downloadFile}
                                addNotification={this.addNotification}
                                model={model}
                            />
                        </Section>
                    )}
                    {children && <Section>{children}</Section>}
                </PanelContent>
            )}
            </PanelWrapper>
        );
    }
}

Detail.defaultProps = {
    item: null,
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
    model: '',
    logFilterFromDetail: noop,
    logDownloadFromDetail: noop,
    logCopyFromDetail: noop,
    Title,
    Tabs: noop,
    children: null,
    Metadata,
    Actions,
};

Detail.propTypes = {
    item: PropTypes.shape({
        key: PropTypes.string,
        description: PropTypes.shape(),
    }),
    downloadFile: PropTypes.func,
    filterUp: PropTypes.func,
    addNotification: PropTypes.func,
    model: PropTypes.string,
    logFilterFromDetail: PropTypes.func,
    logDownloadFromDetail: PropTypes.func,
    logCopyFromDetail: PropTypes.func,
    Title: PropTypes.elementType,
    Tabs: PropTypes.elementType,
    children: PropTypes.node,
    Metadata: PropTypes.elementType,
    Actions: PropTypes.elementType,
};

export default Detail;
