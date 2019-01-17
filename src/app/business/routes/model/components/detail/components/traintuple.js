/* global Blob */
import React from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-prettify';
import {atomOneLight} from 'react-json-prettify/dist/themes';
import {saveAs} from 'file-saver';
import {slate, tealish} from '../../../../../../../../assets/css/variables';
import CopySimple from '../../../../../common/svg/copy-simple';
import DownloadSimple from '../../../../../common/svg/download-simple';


const owkin = {
    ...atomOneLight,
    keyQuotes: slate,
    valueQuotes: 'rgb(140, 153, 165)',
    key: slate,
    value: {
        ...atomOneLight.value,
        string: 'rgb(140, 153, 165)',
        number: tealish,
    },
};

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
            <div>
                <div>
                    Traintuple
                    <span onClick={this.copyTraintuple}>
                        <CopySimple width={15} height={15} />
                    </span>
                    <span onClick={this.downloadTraintuple}>
                        <DownloadSimple width={15} height={15} />
                    </span>
                </div>
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
