/* global Blob */
import React from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-prettify';
import {atomOneLight} from 'react-json-prettify/dist/themes';
import {saveAs} from 'file-saver';
import {css} from 'emotion';
import styled from '@emotion/styled';
import CopySimple from '../../../../../common/svg/copy-simple';
import DownloadSimple from '../../../../../common/svg/download-simple';
import {slate, darkSkyBlue} from '../../../../../../../../assets/css/variables/colors';
import IconButton from '../../../../../common/components/detail/components/iconButton';
import {fontLarge} from '../../../../../../../../assets/css/variables/font';
import {spacingExtraSmall, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';


const owkin = {
    ...atomOneLight,
    keyQuotes: slate,
    valueQuotes: 'rgb(140, 153, 165)',
    key: slate,
    value: {
        ...atomOneLight.value,
        string: 'rgb(140, 153, 165)',
        number: darkSkyBlue,
    },
};

const Top = styled('div')`
    margin-bottom: ${spacingExtraSmall};
`;

const Title = styled('span')`
    font-size: ${fontLarge};
    margin-right: ${spacingSmall};
    font-weight: bold;
`;

const iconButton = css`
    margin-right: ${spacingExtraSmall};
`;

const container = css`
    pre {
        margin: 0;
    }
`;

class Traintuple extends React.Component {
    copyTraintuple = () => {
        const {addNotification, traintuple} = this.props;
        addNotification(JSON.stringify(traintuple), 'Traintuple successfully copied to clipboard!');
    };

    downloadTraintuple = () => {
        const {traintuple} = this.props;
        const jsonBlob = new Blob([JSON.stringify(traintuple)], {type: 'application/json'});
        saveAs(jsonBlob, 'traintuple.json');
    };

    render() {
        const {traintuple} = this.props;
        return (
            <div className={container}>
                <Top>
                    <Title>Traintuple</Title>
                    <IconButton
                        onClick={this.copyTraintuple}
                        className={iconButton}
                        title="Copy traintuple content"
                    >
                        <CopySimple width={15} height={15} />
                    </IconButton>
                    <IconButton
                        onClick={this.downloadTraintuple}
                        className={iconButton}
                        title="Download traintuple"
                    >
                        <DownloadSimple width={15} height={15} />
                    </IconButton>
                </Top>
                <JSONPretty json={traintuple} theme={owkin} />
            </div>
        );
    }
}

const noop = () => {};

Traintuple.defaultProps = {
    traintuple: null,
    addNotification: noop,
};

Traintuple.propTypes = {
    traintuple: PropTypes.shape(),
    addNotification: PropTypes.func,
};

export default Traintuple;
