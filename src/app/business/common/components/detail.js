import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled, {css} from 'react-emotion';
import {onlyUpdateForKeys} from 'recompose';
import ReactMarkdown from 'react-markdown';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {Snackbar, SnackbarContent} from '@material-ui/core';
import {tealish} from '../../../../../assets/css/variables';

import {getItem} from '../selector';

import Search from '../svg/search';
import Permission from '../svg/permission';
import Check from '../svg/check';
import Clipboard from '../svg/clipboard';


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

const SnackbarMessage = styled('div')`
    svg, p {
        ${middle};
    }
    
    p { margin-left: 15px; }
`;

const lightGrey = '#fafafa';

const snackbarContent = css`
    color: ${tealish};
    background-color: ${lightGrey};
    
    @media (min-width: 960px) {
        min-width: 200px;
    }    
`;

class Detail extends Component {
    state = {
        open: false,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // load description from outside EVERY TIME (no cache, no memory consumption, but high requests)
        // TODO : when do we put this in cache?

        if (this.props.item !== prevProps.item) {
            this.props.fetchDescription({
                id: this.props.item.key,
                url: this.props.item.description,
            });
        }
    }

    addNotification = () => {
        this.setState({open: true});
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    render() {
        const {item, className} = this.props;

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
                                <CopyToClipboard text={item.key}>
                                    <span onClick={this.addNotification}>
                                        Copy
                                    </span>
                                </CopyToClipboard>
                                <Snackbar
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    open={this.state.open}
                                    onClose={this.handleClose}
                                    autoHideDuration={2000000}
                                >
                                    <SnackbarContent
                                        className={snackbarContent}
                                        message={(
                                            <SnackbarMessage>
                                                <Check color={tealish} backgroundColor={lightGrey} />
                                                <p>
                                                    Copied to clipboard!
                                                </p>
                                            </SnackbarMessage>)
                                        }
                                    />
                                </Snackbar>
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
                        {item.desc && (
                            <Section>
                                <ReactMarkdown source={item.desc} />
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
    fetchDescription: noop,
};

Detail.propTypes = {
    item: PropTypes.shape({
        key: PropTypes.string,
        descriptionStorageAddress: PropTypes.string,
    }),
    className: PropTypes.string,
    fetchDescription: PropTypes.func,
};

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchDescription: actions.item.description.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'className'])(Detail));
