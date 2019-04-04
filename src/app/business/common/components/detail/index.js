import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import PulseLoader from 'react-spinners/PulseLoader';
import {noop} from 'lodash';

import Title from './components/title';
import Section, {section} from './components/section';
import {PanelWrapper, PanelTop, PanelContent} from '../panel';
import Metadata from './components/metadata';
import Actions from './components/actions';
import Description from './components/description';

class Detail extends React.Component {
    downloadFile = (e) => {
        const {downloadFile, item, logDownloadFromDetail} = this.props;

        downloadFile();
        logDownloadFromDetail(item.key);
    };

    addNotification = (key, text) => (e) => {
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
            item, className, descLoading, model, children,
            Title, BrowseRelatedLinks, Metadata, Description, Actions,
        } = this.props;

        return (
            <div className={className}>
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
                        {BrowseRelatedLinks && <BrowseRelatedLinks item={item} className={section} />}
                        {Description && (
                            <Section>
                                {descLoading && <PulseLoader size={6} />}
                                {!descLoading && <Description item={item} />}
                            </Section>
                        )}
                        {children && <Section>{children}</Section>}
                    </PanelContent>
                )}
                </PanelWrapper>
            </div>
        );
    }
}

Detail.defaultProps = {
    item: null,
    className: '',
    descLoading: false,
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
    model: '',
    logFilterFromDetail: noop,
    logDownloadFromDetail: noop,
    logCopyFromDetail: noop,
    Title,
    children: null,
    BrowseRelatedLinks: null,
    Metadata,
    Description,
    Actions,
};

Detail.propTypes = {
    item: PropTypes.shape({
        key: PropTypes.string,
        description: PropTypes.shape(),
    }),
    descLoading: PropTypes.bool,
    className: PropTypes.string,
    downloadFile: PropTypes.func,
    filterUp: PropTypes.func,
    addNotification: PropTypes.func,
    model: PropTypes.string,
    logFilterFromDetail: PropTypes.func,
    logDownloadFromDetail: PropTypes.func,
    logCopyFromDetail: PropTypes.func,
    Title: PropTypes.func,
    children: PropTypes.node,
    BrowseRelatedLinks: PropTypes.func,
    Metadata: PropTypes.func,
    Description: PropTypes.func,
    Actions: PropTypes.func,
};

export default Detail;
