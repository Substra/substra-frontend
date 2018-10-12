import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {onlyUpdateForKeys} from 'recompose';
import {isEmpty} from 'lodash';

import JSONPretty from 'react-json-prettify';
import {atomOneLight} from 'react-json-prettify/dist/themes';
import {slate, tealish} from '../../../../../../../assets/css/variables';

import Chart from './chart';

import Search from '../../../../common/svg/search';
import Alert from '../../../../common/svg/alert';

import {getChallengeFilters, getOrderedResults, getConfig} from '../../selector';
import {getItem} from '../../../../common/selector';

const owkin = {
    ...atomOneLight,
    keyQuotes: slate,
    valueQuotes: 'rgb(140, 153, 165)',
    key: slate,
    value: {
        ...atomOneLight.value,
        string: 'rgb(140, 153, 165)',
        number: tealish,
    },
};


const middle = css`
    display: inline-block;
    vertical-align: middle;
`;

const Content = styled('div')`
    font-size: 13px;
    position: relative;
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

const NoChallenges = styled('div')`
    position: absolute;
     top: 40%;
    left: 0;
    right: 0;
    text-align: center;
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
            className, challengeFilters, config, loading, item, model,
            over, out,
            actions,
        } = this.props;

        console.log('render');

        return (
            <Content className={className}>
                <Top>
                    <Search width={14} height={14} className={search}/>
                    <H5>
                        overview
                    </H5>
                </Top>
                {!loading && (
                    <Fragment>
                        {!challengeFilters.length && (
                            <NoChallenges>
                                <Alert/>
                                <h3>
                                    Overview unavailable
                                </h3>
                                <p>
                                    Add at least a challenge filter to see comparable performances!
                                </p>
                            </NoChallenges>
                        )}
                        {!!challengeFilters.length && (
                            <div>
                                <Chart config={config} over={over} out={out} actions={actions} model={model}/>
                                {!isEmpty(item) && <JSONPretty json={item} theme={owkin}/>}
                            </div>)
                        }
                    </Fragment>)
                }
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
    model, filterUp, downloadFile, addNotification, ...props
}) => ({
    loading: state[model].list.loading,
    item: getItem(state, model),
    model,
    filterUp,
    downloadFile,
    addNotification,
    challengeFilters: getChallengeFilters(state),
    results: getOrderedResults(state, model),
    config: getConfig(state, model),
    ...props,
});


export default connect(mapStateToProps)(onlyUpdateForKeys(['className', 'item', 'challengeFilters', 'config', 'loading'])(Detail));
