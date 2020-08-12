/* global window */
import React, {Component} from 'react';
import {css} from 'emotion';
import PropTypes from '../../../../utils/propTypes';
import {spacingLarge, spacingNormal} from '../../../../../assets/css/variables/spacing';
import {white, ice} from '../../../../../assets/css/variables/colors';

const MIN_COL_WIDTH = 250;

export const middle = css`
    display: inline-block;
    vertical-align: top;
`;

export const margin = 40;
const barSize = 15;
const halfBarSize = (barSize - 1) / 2;

export const verticalBar = css`
    ${middle};
    width: ${barSize}px;
    margin-right: -${halfBarSize}px;
    margin-left: -${halfBarSize}px;
    z-index: 1;
    cursor: col-resize;
    background-color: transparent;
    flex-grow: 0;
    flex-shrink: 0;
    
    position: relative;
    :before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: ${halfBarSize}px;
        border-left: 1px solid ${ice};    
    }
`;


class TwoPanelLayout extends Component {
    state = {
        hold: false,
    };

    constructor(props) {
        super(props);
        const {defaultLeftPanelWidth} = this.props;
        this.state.leftPanelWidth = defaultLeftPanelWidth;
        this.contentRef = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions = () => {
        if (this.contentRef.current) {
            const containerWidth = this.contentRef.current.offsetWidth;
            const leftPanelWidth = this.state.leftPanelWidth.unit === '%' ? this.state.leftPanelWidth.value * containerWidth / 100 : this.state.leftPanelWidth.value;

            this.updateLeftPanelWidth(containerWidth, leftPanelWidth);
        }
    };

    move = (e) => {
        if (this.state.hold) {
            e.persist();

            const containerWidth = e.currentTarget.offsetWidth;
            const leftPanelWidth = e.clientX - margin - 1;
            this.updateLeftPanelWidth(containerWidth, leftPanelWidth);
        }
    };

    updateLeftPanelWidth(containerWidth, leftPanelWidth) {
        const MAX_COL_WIDTH = Math.max(0, containerWidth - MIN_COL_WIDTH);
        const actualLeftPanelWidth = Math.min(Math.max(MIN_COL_WIDTH, leftPanelWidth), MAX_COL_WIDTH);

        this.setState((state) => ({
                ...state,
                leftPanelWidth: {value: actualLeftPanelWidth, unit: 'px'},
            }
        ));
    }

    mouseDown = () => this.setState((state) => ({
        ...state,
        hold: true,
    }));

    mouseUp = () => {
        if (this.state.hold) {
            this.setState((state) => ({
                ...state,
                hold: false,
            }));
        }
    };

    getLayout = () => css`
        margin: 0 ${spacingLarge} ${spacingNormal} ${spacingLarge};
        background-color: ${white};
        border: 1px solid ${ice};
        display: flex;
        flex: 1;
        align-items: stretch;
        overflow: hidden;
        ${this.state.hold ? `
            cursor: col-resize;
            user-select: none;
        ` : ''}
    `;

    getLeftPanel = (rightPanelContent) => css`
        width: ${rightPanelContent ? `${this.state.leftPanelWidth.value}${this.state.leftPanelWidth.unit}` : '100%'};
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        overflow: hidden;
    `;

    getRightPanel = css`
            flex-grow: 1;
            display: flex;
            overflow: hidden;
        `;

    render() {
        const {leftPanelContent, rightPanelContent} = this.props;

        return (
            <div
                ref={this.contentRef}
                onMouseMove={this.move}
                onMouseUp={this.mouseUp}
                className={this.getLayout()}
            >
                <div className={this.getLeftPanel(rightPanelContent)}>
                    {leftPanelContent}
                </div>

                {rightPanelContent && (
                    <>
                        <div
                            onMouseDown={this.mouseDown}
                            className={verticalBar}
                        />
                        <div className={this.getRightPanel}>
                            {rightPanelContent}
                        </div>
                    </>
                )}
            </div>
        );
    }
}

TwoPanelLayout.propTypes = {
    defaultLeftPanelWidth: PropTypes.shape({
        value: PropTypes.number,
        unit: PropTypes.string,
    }),
    leftPanelContent: PropTypes.node.isRequired,
    rightPanelContent: PropTypes.node,
};

TwoPanelLayout.defaultProps = {
    defaultLeftPanelWidth: {value: 40, unit: '%'},
    rightPanelContent: null,
};

export default TwoPanelLayout;
