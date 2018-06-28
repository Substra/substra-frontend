import React, {Component} from 'react';
import {connect} from 'react-redux';
import {css} from 'react-emotion';

import {bindActionCreators} from 'redux';

import actions from '../actions';
import List from './list';

const list = css`
    width: 60%;
    overflow-x: auto;
`;


class Algorithm extends Component {
    constructor(props) {
        super(props);

        if (!props.init && typeof window !== 'undefined') {
            props.fetchList();
        }
    }

    render() {
        const {loading, results} = this.props;

        return (<div>
            <List results={results} loading={loading} className={list}/>
        </div>)
    }
}

const mapStateToProps = state => ({
    init: state.algorithm.list.init,
    loading: state.algorithm.list.loading,
    results: state.algorithm.list.results,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchList: actions.list.request
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Algorithm);
