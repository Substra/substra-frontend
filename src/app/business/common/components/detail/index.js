import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {PulseLoader} from 'react-spinners';

import DownloadSimple from '../../svg/download-simple';
import FilterUp from '../../svg/filter-up';
import Title from './components/title';
import Section, {section} from './components/section';
import PanelTop from '../panelTop';
import Metadata from './components/metadata';
import IconButton from './components/iconButton';
import Actions from './components/actions';
import Description from './components/description';

const downloadButtonTitles = {
    challenge: 'Download metrics',
    dataset: 'Download opener',
    algo: 'Download algorithm',
    model: 'Download endmodel',
};

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
            item, className, descLoading, model, Title, children, BrowseRelatedLinks,
            Metadata, Description,
        } = this.props;

        return (
            <div className={className}>
                <PanelTop className={css`justify-content: space-between;`}>
                    <Title item={item} />
                    <Actions>
                        <IconButton onClick={this.downloadFile} title={downloadButtonTitles[model]}>
                            <DownloadSimple width={15} height={15} />
                        </IconButton>
                        <IconButton onClick={this.filterUp(item.name)} title="Filter">
                            <FilterUp width={15} height={15} />
                        </IconButton>
                    </Actions>
                </PanelTop>
                {item && (
                    <React.Fragment>
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
                    </React.Fragment>
)}
            </div>
        );
    }
}

const noop = () => {
};
const dummy = () => null;

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
    BrowseRelatedLinks: dummy,
    Metadata,
    Description,
};

Detail.propTypes = {
    item: PropTypes.shape({
        key: PropTypes.string,
        descriptionStorageAddress: PropTypes.string,
        description: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({}),
        ]),
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
};

export default Detail;
