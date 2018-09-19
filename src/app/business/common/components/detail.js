import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled, {css} from 'react-emotion';
import {onlyUpdateForKeys} from 'recompose';
import ReactMarkdown from 'react-markdown';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {PulseLoader} from 'react-spinners';

import {getItem} from '../selector';

import Search from '../svg/search';
import Permission from '../svg/permission';
import Clipboard from '../svg/clipboard';
import CopySimple from '../svg/copy-simple';
import DownloadSimple from '../svg/download-simple';
import FilterUp from '../svg/filter-up';

import {coolBlue} from '../../../../../assets/css/variables';


const middle = css`
    display: inline-block;
    vertical-align: middle;
`;

const Content = styled('div')`
    font-size: 13px;
`;

const Section = styled('div')`
    margin: 8px 0;
`;

const Top = styled('div')`
    background-color: #f7f8f8;
    padding: 3px 10px 3px 12px;
    color: #4b6073;
`;

const H5 = styled('h5')`
    ${middle};
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
    padding-right: 13px;
`;


class Detail extends Component {


    // TODO, manage other entities
    downloadFile = (e) => {
        // we need to act as a proxy as we need to pass the version for downloading th efile

        const {downloadFile} = this.props;

        downloadFile();
    };

    addNotification = key => (e) => {
        const {addNotification} = this.props;

        addNotification(key);
    };

    filterUp = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.filterUp(o);
    };

    render() {
        const {item, className, model, descLoading} = this.props;

        return (
            <Content className={className}>
                <Top>
                    <Search width={14} height={14} className={search}/>
                    <H5>
                        {item ? item.name : ''}
                    </H5>
                </Top>
                {item && (
                    <Item>
                        <Section>
                            <Clipboard className={clipboard} width={15}/>
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
                                <CopyToClipboard text={item.key}>
                                    <span onClick={this.addNotification(item.key)}>
                                        <CopySimple width={22} height={22} className={icon}/>
                                    </span>
                                </CopyToClipboard>
                                <FilterUp onClick={this.filterUp(item.name)} className={icon}/>
                            </Right>
                        </Section>
                        <Section>
                            {item.permissions === 'all' && (
                                <Fragment>
                                    <Permission width={13} height={13} className={permission}/>
                                    <span>
                                        {': Open to all'}
                                    </span>
                                </Fragment>)
                            }
                        </Section>
                        {descLoading && <PulseLoader size={6} color={coolBlue}/>}
                        {!descLoading && item.desc && (
                            <Section>
                                <ReactMarkdown source={item.desc}/>
                            </Section>
                        )}
                    </Item>)}
            </Content>
        );
    }
}

const noop = () => {
};

Detail.defaultProps = {
    item: null,
    className: '',
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
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
    className: PropTypes.string,
    model: PropTypes.string.isRequired,
    downloadFile: PropTypes.func,
    filterUp: PropTypes.func,
    addNotification: PropTypes.func,
};

const mapStateToProps = (state, {model, filterUp, downloadFile, addNotification}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    filterUp,
    downloadFile,
    addNotification,
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'className', 'descLoading'])(Detail));
