import React, {Component} from 'react';
import {connect} from 'react-redux';
import {css} from 'emotion';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import SubstraLogo from '../../common/components/icons/substraLogo';
import {alertTitle, alertWrapper} from '../../common/components/alert';

import {signIn as signInActions} from '../actions';
import FormTemplate from './form';
import {getError} from '../selector';
import {spacingLarge, spacingNormal} from '../../../../../assets/css/variables/spacing';
import {
ice, iceRed, red, white,
} from '../../../../../assets/css/variables/colors';
import {fontLarge} from '../../../../../assets/css/variables/font';

const main = css`
    padding: ${spacingNormal};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: ${fontLarge};
`;

const title = css`
  margin-bottom: ${spacingLarge};
  margin-top: -110px;
`;

const form = css`
    width: 290px;
    background-color: ${white};
    border: 1px solid ${ice};
    border-radius: 3px;
    padding: ${spacingNormal};
`;

const errorWrapper = css`
    ${alertWrapper};
    width: 290px;
    margin-bottom: ${spacingNormal};
    border-color: ${red};
    background-color: ${iceRed};
`;

const errorTitle = css`
    ${alertTitle};
    color: ${red};
    font-weight: normal;
`;

class Index extends Component {
    signIn = ({username, password}) => {
        this.props.signIn({username, password, previousRoute: this.props.location.prev});
    };

    render() {
        const {signInError} = this.props;

        return (
            <div className={main}>
                <h1 className={title}>
                    <SubstraLogo width={240} />
                </h1>
                {signInError && (
                    <div className={errorWrapper}>
                        <div className={errorTitle}>{signInError}</div>
                    </div>
                )}
                <div className={form}>
                    <FormTemplate
                        signIn={this.signIn}
                    />
                </div>
            </div>
        );
    }
}

Index.propTypes = {
    signInError: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.bool,
        PropTypes.string,
    ]),
    signIn: PropTypes.func,
    location: PropTypes.shape({
        prev: PropTypes.shape({}),
    }).isRequired,
};

Index.defaultProps = {
    signInError: null,
    signIn: null,
};

const mapStateToProps = (state) => ({
        // get previousRoute from state
        location: state.location,
        signInError: getError(state),
    });

const mapDispatchToProps = (dispatch) => bindActionCreators({
        signIn: signInActions.request,
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Index);
