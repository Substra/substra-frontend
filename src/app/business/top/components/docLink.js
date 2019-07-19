import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {noop} from 'lodash';

import {Book} from '@substrafoundation/substra-ui';
import withAnalytics, {LOG_DOC} from '../../../analytics';
import {slate} from '../../../../../assets/css/variables/colors';

const picto = css`
    display: block;
`;

export class DocLink extends Component {
    logDoc = () => {
        const {logDoc} = this.props;
        logDoc();
    };

    render() {
        const {className} = this.props;
        return (
            <a
                href="https://github.com/substrafoundation/substra-doc"
                className={className}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link"
                onClick={this.logDoc}
            >
                <Book className={picto} color={slate} />
                Docs
            </a>
        );
    }
}

DocLink.propTypes = {
    className: PropTypes.string,
    logDoc: PropTypes.func,
};

DocLink.defaultProps = {
    className: null,
    logDoc: noop,
};

export default withAnalytics(DocLink, [LOG_DOC]);
