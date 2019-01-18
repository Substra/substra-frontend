import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import ReactMarkdown from 'react-markdown';
import {PulseLoader} from 'react-spinners';
import {capitalize} from 'lodash';


import Search from '../../svg/search';
import Permission from '../../svg/permission';
import Clipboard from '../../svg/clipboard';
import CopySimple from '../../svg/copy-simple';
import DownloadSimple from '../../svg/download-simple';
import FilterUp from '../../svg/filter-up';
import Title from './components/title';
import Section, {section} from './components/section';

import {coolBlue} from '../../../../../../assets/css/variables';


const middle = css`
    display: inline-block;
    vertical-align: middle;
`;

const Content = styled('div')`
    font-size: 13px;
`;

const Top = styled('div')`
    background-color: #f7f8f8;
    padding: 3px 10px 3px 12px;
    color: #4b6073;
`;

const H5 = styled('h5')`
    font-size: 13px;
    margin: 0;
    display: inline-block;
    padding-left: 7px;
    color: #edc20f;
`;

const search = css`
    ${middle};
`;

const Item = styled('div')`
    font-size: 12px;
    padding: 9px 33px;
`;

const permission = css`
    ${middle};
    padding-right: 10px;
    
    & + span {
        ${middle};        
    }
`;

const clipboard = css`
    ${middle};
    padding-right: 6px;
`;

const idText = css`
    ${middle};
`;

const id = css`
    font-weight: bold;
`;

const Right = styled('div')`
    float: right;
`;

const icon = css`
    cursor: pointer;
    margin-left: 13px;
`;


class Detail extends Component {
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
        } = this.props;

        return (
            <Content className={className}>
                <Top>
                    <Search width={14} height={14} className={search} />
                    <H5 className={middle}>
                        <Title item={item} />
                    </H5>
                </Top>
                {item && (
                    <Item>
                        <Section>
                            <Clipboard className={clipboard} width={15} />
                            <div className={idText}>
                                <span className={id}>
                                    {'ID: '}
                                </span>
                                {item.key}
                            </div>
                            <Right>
                                <DownloadSimple
                                    width={22}
                                    height={22}
                                    onClick={this.downloadFile}
                                    className={icon}
                                />
                                <span onClick={this.addNotification(item.key, `${capitalize(model)}'s key successfully copied to clipboard!`)}>
                                    <CopySimple width={22} height={22} className={icon} />
                                </span>
                                <FilterUp onClick={this.filterUp(item.name)} className={icon} />
                            </Right>
                        </Section>
                        <Section>
                            {item.permissions === 'all' && (
                                <Fragment>
                                    <Permission width={13} height={13} className={permission} />
                                    <span>
                                        {': Open to all'}
                                    </span>
                                </Fragment>
)
                            }
                        </Section>
                        {BrowseRelatedLinks && <BrowseRelatedLinks item={item} className={section} />}
                        {descLoading && <PulseLoader size={6} color={coolBlue} />}
                        {!descLoading && item.desc && (
                            <Section>
                                <ReactMarkdown source={item.desc} />
                            </Section>
                        )}
                        {children && <Section>{children}</Section>}
                    </Item>
)}
            </Content>
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
};

export default Detail;
