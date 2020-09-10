import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import PulseLoader from 'react-spinners/PulseLoader';
import {noop} from 'lodash';

import {PanelWrapper, PanelTop, PanelContent} from '../panel';

import Title from './components/title';
import Sort from './components/sort/redux';
import Item from './components/item';
import Actions from './components/actions';

import {gold, iceGold} from '../../../../../assets/css/variables/colors';
import {spacingNormal} from '../../../../../assets/css/variables/spacing';
import NoItemFound from './components/noItemFound';

const PulseLoaderWrapper = styled('div')`
    margin: ${spacingNormal};
`;

class List extends Component {
    state = {
        hoverItem: null,
    };

    componentDidMount(prevProps, prevState, snapshot) {
        const {
            loading, fetchList,
        } = this.props;

        if (!loading) {
            fetchList();
        }
    }

    setSelected = (item) => () => {
        const {setSelected} = this.props;
        setSelected(item);
    };

    hover = (item) => (e) => {
        e.stopPropagation();

        const {hover} = this.props;

        if (!this.isSelected(item.key)) {
            this.setState((state) => ({
                ...state,
                hoverItem: item.key,
            }));

            if (hover) {
                hover(item);
            }
        }
    };

    out = (item) => (e) => {
        const {out} = this.props;

        e.stopPropagation();

        this.setState((state) => ({
            ...state,
            hoverItem: null,
        }));

        if (out) {
            out(item);
        }
    };

    isSelected = (key) => {
        const {selected} = this.props;

        return selected === key;
    };

    itemWrapper = (key) => {
        const hovered = this.state.hoverItem === key;
        const selected = this.isSelected(key);

        return css`
            position: relative;
            background-color: ${hovered || selected ? iceGold : 'transparent'};

            &:before {
                display: block;
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 4px;
                background-color: ${selected ? gold : 'transparent'};
            }
        `;
    };


    render() {
        const {
            results, init, loading, model, download,
            Title, Metadata, Sort, setOrder,
            Actions, addNotification, filterUp, downloadFile,
        } = this.props;


        return (
            <>
                <PanelWrapper>
                    <PanelTop>
                        <Sort model={model} setOrder={setOrder} />
                    </PanelTop>
                    <PanelContent>
                        {loading && (
                            <PulseLoaderWrapper>
                                <PulseLoader size={6} />
                            </PulseLoaderWrapper>
                        )}
                        {init && !loading && !results.length && (
                            <p>
                                There is no items
                            </p>
                        )}
                        {init && !loading && !!results.length
                            && (results.map((o, i) => (
                                <div key={i}>
                                    {!!o.length && o.map((o) => (
                                        <Item
                                            key={o.key}
                                            onClick={this.setSelected(o)}
                                            onMouseEnter={this.hover(o)}
                                            onMouseLeave={this.out(o)}
                                            className={this.itemWrapper(o.key)}
                                        >
                                            <Title o={o} />
                                            <Actions
                                                model={model}
                                                download={download}
                                                item={o}
                                                addNotification={addNotification}
                                                filterUp={filterUp}
                                                downloadFile={downloadFile}
                                            />
                                            {Metadata && <Metadata o={o} />}
                                        </Item>
                                        ))}
                                    {!o.length && <NoItemFound model={model} />}
                                </div>
                            ))
                        )}
                    </PanelContent>
                </PanelWrapper>
            </>
        );
    }
}

const order = {by: '', direction: 'asc'};

List.defaultProps = {
    init: false,
    loading: false,
    results: [],
    selected: '',
    order,
    model: '',
    download: {},
    setSelected: noop,
    setOrder: noop,
    fetchList: noop,
    filterUp: noop,
    downloadFile: noop,
    addNotification: noop,
    hover: noop,
    out: noop,
    Title,
    Actions,
    Metadata: null,
    Sort,
};

List.propTypes = {
    init: PropTypes.bool,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))),
    selected: PropTypes.string,
    order: PropTypes.shape({}),
    model: PropTypes.string,
    download: PropTypes.shape({
        address: PropTypes.arrayOf(PropTypes.string),
        filename: PropTypes.string,
    }),
    setSelected: PropTypes.func,
    setOrder: PropTypes.func,
    fetchList: PropTypes.func,
    filterUp: PropTypes.func,
    downloadFile: PropTypes.func,
    addNotification: PropTypes.func,
    hover: PropTypes.func,
    out: PropTypes.func,
    Title: PropTypes.func,
    Metadata: PropTypes.func,
    Sort: PropTypes.elementType,
    Actions: PropTypes.elementType,
};

export default List;
