import React, {Component} from 'react';
import {connect} from 'react-redux';
import {css} from 'emotion';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import {signIn as signInActions} from '../actions';
import FormTemplate from './form';
import {getError} from '../selector';

const main = css`
    margin: 0 auto;
    padding: 10% 0 0;
`;

const form = css`
    width: 380px;
    margin: 0 auto;;
    background-color: #fff;
    padding: 50px 30px 10px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05);
`;

const error = css`
    color: red;
`;

class Index extends Component {
    signIn = ({username, password}) => {
        this.props.signIn({username, password, previousRoute: this.props.location.prev});
    };

    render() {
        const {signInError} = this.props;

        return (
            <div className={main}>
                <div className={form}>
                    <h1>Substra</h1>
                    {signInError && (
                        <span className={error}>
                            {signInError}
                        </span>
                    )}
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

const mapStateToProps = state => ({
        // get previousRoute from state
        location: state.location,
        signInError: getError(state),
    });

const mapDispatchToProps = dispatch => bindActionCreators({
        signIn: signInActions.request,
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Index);
