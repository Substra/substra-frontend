import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {RoundedButton} from '@substrafoundation/substra-ui';
import {spacingNormal} from '../../../../../../../assets/css/variables/spacing';

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

class ForbiddenResource extends Component {
    handleClick = () => {
        const {setTabIndex, permissionsTabIndex} = this.props;
        setTabIndex(permissionsTabIndex);
    }

    render() {
        const {model, resource} = this.props;
        return (
            <>
                <Span>
                    {`You do not have enough permissions to see this ${model}'s ${resource}.`}
                </Span>
                <RoundedButton onClick={this.handleClick}>
                    Learn more
                </RoundedButton>
            </>
        );
    }
}

ForbiddenResource.propTypes = {
    resource: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    setTabIndex: PropTypes.func.isRequired,
    permissionsTabIndex: PropTypes.number.isRequired,
};

export default ForbiddenResource;
