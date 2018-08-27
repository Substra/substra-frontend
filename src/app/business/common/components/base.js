/* global window */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {css} from 'react-emotion';
import {connect} from 'react-redux';

import List from './list';
import Detail from './detail';

const middle = css`
    display: inline-block;
    vertical-align: top;
`;

const margin = 20;
const barSize = 1;

const verticalBar = css`
    ${middle};
    width: ${barSize}px;
    background-color: #ccc;
    cursor: col-resize;
`;

class Base extends Component {
    state = {
        width: {
            list: {value: 40, unit: '%'},
            detail: {value: 59, unit: '%'},
        },
        hold: false,
    };

    constructor(props) {
        super(props);
        this.contentRef = React.createRef();
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        if (this.contentRef.current) {
            const oldWidth = this.state.width.list.value + this.state.width.detail.value,
                newWidth = this.contentRef.current.offsetWidth;

            this.setState(state => ({
                width: {
                    list: {value: state.width.list.value * newWidth / oldWidth, unit: 'px'},
                    detail: {value: state.width.detail.value * newWidth / oldWidth, unit: 'px'},
                },
            }));
        }
    };

    move = (e) => {
        if (this.state.hold) {
            this.setState({
                width: {
                    list: {value: e.screenX - margin, unit: 'px'},
                    detail: {value: e.currentTarget.offsetWidth - (e.screenX - margin) - barSize, unit: 'px'},
                },
            });
        }
    };

    mouseDown = () => this.setState({hold: true});

    mouseUp = () => this.setState({hold: false});

    list = () => css`
        ${middle};
        width: ${this.props.selected ? `${this.state.width.list.value}${this.state.width.list.unit}` : '100%'};
        overflow-x: auto;
    `;

    detail = () => css`
        ${middle};
        width: ${this.props.selected ? `${this.state.width.detail.value}${this.state.width.detail.unit}` : '100%'};
        overflow-x: auto;
    `;

    content = () => css`
        margin: 0 ${margin}px;
        display: flex;
        flex: 1;
        ${this.state.hold ? `
            cursor: col-resize;
            user-select: none;
        ` : ''}
    `;

    render() {
        const {selected, actions, model} = this.props;

        return (
            <div ref={this.contentRef} onMouseMove={this.move} className={this.content()}>
                <List className={this.list()} model={model} actions={actions} />
                {selected && (
                    <Fragment>
                        <div
                            onMouseDown={this.mouseDown}
                            onMouseUp={this.mouseUp}
                            className={verticalBar}
                        />
                        <Detail className={this.detail()} model={model} actions={actions} />
                    </Fragment>)}
            </div>);
    }
}

Base.defaultProps = {
    selected: null,
};

Base.propTypes = {
    selected: PropTypes.string,
    actions: PropTypes.shape({}).isRequired,
    model: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state, {model, actions}) => ({
    selected: state[model].list.selected,
    model,
    actions,
});

export default connect(mapStateToProps)(Base);
