import React from 'react';
import PropTypes from 'prop-types';
import fetchJsonp from 'fetch-jsonp';
import styled, {css} from 'react-emotion';

import {slate} from '../../../../assets/css/variables/index';

const Search = styled('div')`
    margin-bottom: 60px;    
`;

const Title = styled('span')`
     display: block;
     font-weight: 500;
     font-size: 14px;
     padding-bottom: 11px;
     letter-spacing: 1.5px;
     font-family: nunitomedium, sans-serif;
`;

const Wrapper = styled('div')`
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.2);
    width: 460px;
    margin: 0 auto;
    text-align: left;
         
    input {
         width: 314px;
         border: none;
         padding: 13px 13px;
         color: ${slate};
         letter-spacing: 1.5px;
         font-size: 14px;
         font-family: nunitoregular, sans-serif;
    }
    
    input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: rgba(53, 117, 137, 0.2);
        opacity: 1; /* Firefox */
    }
    
    input:-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(53, 117, 137, 0.2);
    }
    
    input::-ms-input-placeholder { /* Microsoft Edge */
        color: rgba(53, 117, 137, 0.2);
    }
    
    button {
        border: none;
        width: 120px;
        padding: 13px 20px;
        color: #fff;
        line-height: normal;
        letter-spacing: 1.5px;
        font-size: 14px;
        font-family: nunitomedium, sans-serif;
        background-color: #1dbcc0;
        cursor: pointer;
    }
`;

const success = css`
    margin-top: 20px;
    display: block;
    color: green;
    font-size: 12px;
`;

class SignIn extends React.Component {
    state = {
        email: '',
    };

    getErrorMsg = () => ({__html: this.state.msg});

    change = (e) => {
        this.setState({...this.state, email: e.target.value});
    };

    keyUp = (e) => {
        if (e.keyCode === 13) {
            this.subscribe();
        }
    };

    valid_email = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    subscribe = () => {
        // TODO use redux-saga

        if (this.valid_email(this.state.email)) {
            const url = `https://github.us18.list-manage.com/subscribe/post-json?u=385fa3f9736ea94a1fcca969f&id=a80365310d&EMAIL=${this.state.email}`,
                headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                };

            fetchJsonp(url, {
                method: 'POST',
                headers,
                jsonpCallback: 'c',
            }).then(response => response.json()).then(({result, msg}) => {
                this.setState({...this.state, result, msg});
            }).catch(error => console.log(error));
        }
        else {
            this.setState({...this.state, result: 'error', msg: 'Please enter a valid email address.'});
        }
    };

    render() {
        const {className} = this.props;

        return (<Search className={className && className.search}>
            <Title className={className && className.title}>
                Sign in to ou newsletter to be updated about our project
            </Title>
            <Wrapper className={className && className.wrapper}>
                <input type="email" placeholder="enter your email here" onChange={this.change} onKeyUp={this.keyUp} />
                <button onClick={this.subscribe}>Subscribe</button>
            </Wrapper>
            {this.state.result === 'error' && <span className="error" dangerouslySetInnerHTML={this.getErrorMsg()} />}
            {this.state.result === 'success' && <span className={success}>{this.state.msg}</span>}
        </Search>);
    }
}

SignIn.defaultProps = {
    className: {},
};

SignIn.propTypes = {
    className: PropTypes.shape({}),
};

export default SignIn;
