import React, {Component} from 'react';
import {css} from 'emotion';
import {noop} from 'lodash';

import PropTypes from 'prop-types';
import IconButton from '../../iconButton';
import More from '../../../svg/more-vertical';

import {spacingExtraSmall} from '../../../../../../../assets/css/variables/spacing';

const actions = css`
    position: absolute;
    right: ${spacingExtraSmall};
    top: ${spacingExtraSmall};
    
    svg {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
    }
`;

class Actions extends Component {
    openPopover = (e) => {
        const {openPopover} = this.props;
        openPopover(e);
    };

    render() {
        return (
            <div className={actions}>
                <IconButton
                    onClick={this.openPopover}
                    title="Show actions"
                    noBorder
                >
                    <More height={16} />
                </IconButton>
            </div>
        );
    }
}

Actions.propTypes = {
    openPopover: PropTypes.func,
};

Actions.defaultProps = {
    openPopover: noop,
};

export default Actions;
