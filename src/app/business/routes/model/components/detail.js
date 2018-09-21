import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {onlyUpdateForKeys} from 'recompose';

import Search from '../../../common/svg/search';


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


class Detail extends Component {
    downloadFile = (e) => {
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
        const {
            className,
        } = this.props;

        return (
            <Content className={className}>
                <Top>
                    <Search width={14} height={14} className={search}/>
                    <H5>
                        overview
                    </H5>
                </Top>
                <h1>display graph</h1>
            </Content>
        );
    }
}

const noop = () => {
};

Detail.defaultProps = {
    className: '',
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
};

Detail.propTypes = {
    className: PropTypes.string,
    downloadFile: PropTypes.func,
    filterUp: PropTypes.func,
    addNotification: PropTypes.func,
};

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    filterUp,
    downloadFile,
    addNotification,
});


export default connect(mapStateToProps)(onlyUpdateForKeys(['className'])(Detail));
