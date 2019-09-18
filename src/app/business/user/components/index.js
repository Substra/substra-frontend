import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import {signIn as signInActions} from '../actions';
import FormTemplate from './form';
import {getError} from '../selector';

const style = {
    logo: {
        margin: '0 auto 40px',
        display: 'block',
    },
    main: {
        margin: '0 auto',
        padding: '10% 0 0',
    },
    title: {
        fontSize: '3.5rem',
        fontWeight: '300',
    },
    form: {
        width: 380,
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '50px 30px 10px',
        borderRadius: 10,
        textAlign: 'center',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.05)',
    },
    p: {
        margin: '10px 0 30px',
    },
};

class Index extends Component {
    signIn = ({username, password}) => {
        this.props.signIn({username, password, previousRoute: this.props.location});
    };

    render() {
        const {signInError} = this.props;

        return (
            <div style={style.main}>
                <div style={style.form}>
                    <h1>Substra</h1>
                    {signInError && (
                    <div className="error">
                        <ul>
                            {signInError.length && Object.keys(signInError).map(o => (
                                <li key={o}>
                                    {o}
:
                                    <ul>{signInError[o].map(x => <li key={x}>{x}</li>)}</ul>
                                </li>
))}
                        </ul>
                        {signInError.detail || signInError.message}
                    </div>
)}
                    <FormTemplate
                        signInError={signInError}
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

function mapStateToProps(state) {
    return {
        // get previousRoute from state
        location: state.location,
        signInError: getError(state),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        signIn: signInActions.request,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
