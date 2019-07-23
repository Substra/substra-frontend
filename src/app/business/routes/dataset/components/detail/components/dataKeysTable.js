import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {RoundedButton, CopySimple} from '@substrafoundation/substra-ui';

import {
    Table, Tr, Td, Th,
} from './table';
import {fontNormalMonospace, monospaceFamily} from '../../../../../../../../assets/css/variables/font';
import {spacingExtraSmall} from '../../../../../../../../assets/css/variables/spacing';

const SpaceBetween = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const small = css`
    width: 1px;
`;

const buttonPosition = css`
    margin-right: -${spacingExtraSmall};
`;

const monospace = css`
    font-family: ${monospaceFamily};
    font-size: ${fontNormalMonospace};
`;

class DataKeysTable extends Component {
    state = {
        selectedKeys: [],
        allSelected: false,
    };

    copy = () => {
        const {dataKeys, addNotification} = this.props;
        const {allSelected, selectedKeys} = this.state;
        if (allSelected || selectedKeys.length === 0) {
            addNotification(JSON.stringify(dataKeys), 'All keys successfully copied!');
        }
        else {
            const msg = `${selectedKeys.length} key${selectedKeys.length > 1 && 's'} successfully copied!`;
            addNotification(JSON.stringify(selectedKeys), msg);
        }
    };

    handleGlobalCheckboxChange = (event) => {
        const checked = event.target.checked;
        this.setState({
            allSelected: checked,
            selectedKeys: [],
        });
    };

    handleCheckboxChange = key => (event) => {
        const checked = event.target.checked;
        const {dataKeys} = this.props;
        const {allSelected} = this.state;
        if (allSelected && !checked) {
            this.setState({
                allSelected: false,
                selectedKeys: dataKeys.filter(x => x !== key),
            });
        }
        else if (!checked) {
            this.setState((previousState) => {
                const selectedKeys = previousState.selectedKeys.filter(x => x !== key);
                return {
                    selectedKeys,
                };
            });
        }
        else if (checked) {
            this.setState((previousState) => {
                const selectedKeys = previousState.selectedKeys.concat(key);
                return {
                    allSelected: selectedKeys.length === dataKeys.length,
                    selectedKeys,
                };
            });
        }
    };

    render() {
        const {dataKeys} = this.props;
        const {allSelected, selectedKeys} = this.state;
        return (
            <Table>
                <thead>
                    <Tr>
                        <Th className={small}>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                disabled={!dataKeys.length}
                                onChange={this.handleGlobalCheckboxChange}
                            />
                        </Th>
                        <Th>
                            <SpaceBetween>
                                Keys
                                <RoundedButton
                                    onClick={this.copy}
                                    disabled={!dataKeys.length}
                                    Icon={CopySimple}
                                    className={buttonPosition}
                                >
                                    {'Copy as JSON array'}
                                </RoundedButton>
                            </SpaceBetween>
                        </Th>
                    </Tr>
                </thead>
                <tbody>
                    {dataKeys.map(key => (
                        <Tr key={key}>
                            <Td className={small}>
                                <input
                                    type="checkbox"
                                    id={key}
                                    checked={allSelected || selectedKeys.includes(key)}
                                    onChange={this.handleCheckboxChange(key)}
                                />
                            </Td>
                            <Td className={monospace}>
                                <label htmlFor={key}>{key}</label>
                            </Td>
                        </Tr>
                ))}
                </tbody>
            </Table>
        );
    }
}

DataKeysTable.propTypes = {
    dataKeys: PropTypes.arrayOf(PropTypes.string),
    addNotification: PropTypes.func,
};

DataKeysTable.defaultProps = {
    dataKeys: [],
    addNotification: null,
};

export default DataKeysTable;
