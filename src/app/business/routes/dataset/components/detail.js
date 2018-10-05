import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {onlyUpdateForKeys} from 'recompose';
import ReactMarkdown from 'react-markdown';
import {PulseLoader} from 'react-spinners';
import {capitalize, isArray} from 'lodash';

import Popover from '@material-ui/core/Popover';

import {getItem} from '../../../common/selector';

import Search from '../../../common/svg/search';
import Permission from '../../../common/svg/permission';
import Clipboard from '../../../common/svg/clipboard';
import CopyDrop from '../../../common/svg/copy-drop';
import DownloadSimple from '../../../common/svg/download-simple';
import FilterUp from '../../../common/svg/filter-up';

import {coolBlue} from '../../../../../../assets/css/variables';


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
    padding-right: 13px;
`;

// TODO load from external file
const Action = styled('span')`
    display: block;
    padding: 10px 15px;
    cursor: pointer;
    
    &:hover {
        background-color: #f0f0ef;
    }
`;

const PopList = styled('div')`
    list-style: none;
    margin: 0;
`;

const PopItem = styled('li')`
    border-bottom: 1px solid #eeeeee;
    font-size: 13px;   
`;

const popSubItem = css`
    span {
        padding: 5px 15px;
    }
`;

class Detail extends Component {
    state = {
        popover: {
            open: false,
            anchorEl: null,
            item: null,
        },
    };

    downloadFile = (e) => {
        // we need to act as a proxy as we need to pass the version for downloading th efile

        const {downloadFile} = this.props;

        downloadFile();
    };

    addNotification = (key, text) => (e) => {
        const {addNotification, item} = this.props;

        const inputValue = isArray(item[key]) ? item[key].join(',') : item[key];
        addNotification(inputValue, text);

        this.popoverHandleClose();
    };

    filterUp = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.props.filterUp(o);
    };

    copyMore = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {item} = this.props;

        // display menu
        this.setState({
            popover: {
                open: true,
                anchorEl: e.currentTarget,
                item,
            },
        });
        e.persist();
    };

    popoverHandleClose = () => {
        this.setState(state => ({
            popover: {
                open: false,
                anchorEl: null,
                item: null,
            },
        }));
    };

    render() {
        const {
            item, className, model, descLoading,
        } = this.props;

        return (
            <Content className={className}>
                <Top>
                    <Search width={14} height={14} className={search} />
                    <H5>
                        {item ? item.name : ''}
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
                                <span onClick={this.copyMore}>
                                    <CopyDrop width={22} height={22} className={icon} />
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
                                </Fragment>)
                            }
                        </Section>
                        {descLoading && <PulseLoader size={6} color={coolBlue} />}
                        {!descLoading && item.description && (
                            <Section>
                                <ReactMarkdown source={item.description.content} />
                            </Section>
                        )}
                    </Item>)}
                <Popover
                    open={this.state.popover.open}
                    anchorEl={this.state.popover.anchorEl}
                    onClose={this.popoverHandleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <PopList>
                        <PopItem className={popSubItem}>
                            <Action
                                onClick={this.addNotification('key', `${capitalize(model)}'s key successfully copied to clipboard!`)}
                            >
                                {`Copy ${model}'s key to clipboard`}
                            </Action>
                            <Action
                                onClick={this.addNotification('trainDataKeys', 'Datas\'s key successfully copied to clipboard!')}
                            >
                                Copy all datas' key to clipboard
                            </Action>
                        </PopItem>
                    </PopList>
                </Popover>
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

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    filterUp,
    downloadFile,
    addNotification,
});


export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'className', 'descLoading'])(Detail));
