import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import {noop} from 'lodash';
import {DownloadSimple, FilterUp, IconButton} from '@substrafoundation/substra-ui';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../assets/css/variables/spacing';

export const actions = css`
    margin-right: -${spacingNormal};
    padding-right: ${spacingSmall};

    button {
        margin-left: ${spacingExtraSmall};
    }
`;

const downloadButtonTitles = {
    objective: 'Download metrics',
    dataset: 'Download opener',
    algo: 'Download algorithm',
    model: 'Download endmodel',
};

export const DownloadAction = ({downloadFile, model}) => (
    <IconButton
        Icon={DownloadSimple}
        onClick={downloadFile}
        title={downloadButtonTitles[model]}
    />
);

DownloadAction.propTypes = {
    downloadFile: PropTypes.func,
    model: PropTypes.string,
};

DownloadAction.defaultProps = {
    downloadFile: noop,
    model: '',
};

export const FilterAction = ({filterUp}) => (
    <IconButton
        Icon={FilterUp}
        onClick={filterUp}
        title="Filter"
    />
);

FilterAction.propTypes = {
    filterUp: PropTypes.func,
};

FilterAction.defaultProps = {
    filterUp: noop,
};

const Actions = ({filterUp, downloadFile, model}) => (
    <div className={actions}>
        <DownloadAction downloadFile={downloadFile} model={model} />
        <FilterAction filterUp={filterUp} />
    </div>
);

Actions.propTypes = {
    filterUp: PropTypes.func,
    downloadFile: PropTypes.func,
    model: PropTypes.string,
};

Actions.defaultProps = {
    filterUp: noop,
    downloadFile: noop,
    model: '',
};

export default Actions;
