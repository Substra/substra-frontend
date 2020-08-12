import React, {Component} from 'react';
import {css} from 'emotion';
import copy from 'copy-to-clipboard';

import {Check} from '../icons';
import SnackbarContent from './snackbarContent';

import {slate, tealish} from '../../../../../../assets/css/variables/colors';
import PropTypes from '../../../../../utils/propTypes';

export const middle = `
    display: inline-block;
    vertical-align: top;
`;

export const snackbarContentCSS = `
    color: ${tealish};
    
    @media (min-width: 960px) {
        min-width: 200px;
    }    
`;

export const clipboardContentCSS = `
    ${middle};
    margin-left: 15px;
    input {
        display: block;
        padding: 3px 0;
        border: 1px solid #9b9b9b;
        color: #9b9b9b;
        background-color: transparent;
        outline: none;
        width: 100%;
    }
    
    p {
        color: ${slate};
        font-size: 13px;
        margin: 4px 0 0;
    }
`;

const withAddNotification = (WrappedComponent, Icon = Check) => {
    class CopyNotification extends Component {
        state = {
            open: false,
            key: '',
            text: '',
        };

        componentWillUnmount() {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            if (this.queueTimeout) {
                clearTimeout(this.queueTimeout);
            }
        }

        processNotificationQueue = () => {
            const {delay: {display}} = this.props;
            this.setState((state) => ({
                ...state,
                ...this.queuedNotification,
                open: true,
            }));
            this.timeout = setTimeout(() => {
                this.setState((state) => ({
                    ...state,
                    open: false,
                }));
            }, display);
        };

        addNotification = (key, text) => {
            const {open} = this.state;
            const {delay: {animation}} = this.props;
            copy(key);
            this.queuedNotification = {
                key,
                text,
            };
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            if (open) {
                this.setState((state) => ({
                    ...state,
                    open: false,
                }));
                this.queueTimeout = setTimeout(() => {
                    this.queueTimeout = undefined;
                    this.processNotificationQueue();
                }, animation);
            }
            else if (!this.queueTimeout) { // we click when the notification is closing (open = false but animation still running)
                this.processNotificationQueue();
            }
        };

        snackbar = () => {
            const {open} = this.state;
            const {delay: {animation}} = this.props;
                return css`
                    position: fixed;
                    left: 25px;
                    bottom: ${open ? '25px' : '-80px'};
                    opacity: ${open ? 1 : 0};
                    transition: all ${animation}ms linear;
                `;
        };

        render() {
            const {
                text,
                key,
            } = this.state;
            const {clipboardContentCSS, snackbarContentCSS} = this.props;

            return (
                <>
                    <WrappedComponent addNotification={this.addNotification} {...this.props} />

                    <div
                        data-testid="notification"
                        className={this.snackbar()}
                    >
                        <SnackbarContent
                            className={css`${snackbarContentCSS}`}
                            message={(
                                <div>
                                    <Icon />
                                    <div className={css`${clipboardContentCSS}`}>
                                        <input disabled value={key} />
                                        <p>
                                            {text}
                                        </p>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </>

            );
        }
    }
    CopyNotification.defaultProps = {
        delay: {
            animation: 150,
            display: 2500,
        },
        clipboardContentCSS,
        snackbarContentCSS,
    };

    CopyNotification.propTypes = {
        delay: PropTypes.objectOf(PropTypes.number),
        clipboardContentCSS: PropTypes.string,
        snackbarContentCSS: PropTypes.string,
    };

    return CopyNotification;
};

export default withAddNotification;
