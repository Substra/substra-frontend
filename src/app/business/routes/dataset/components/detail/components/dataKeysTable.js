import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {without} from 'lodash';

import {
    Table, Tr, Td, Th,
} from './table';
import {fontNormalMonospace, monospaceFamily} from '../../../../../../../../assets/css/variables/font';
import RoundedButton from '../../../../../common/components/roundedButton';
import CopySimple from '../../../../../common/svg/copy-simple';

const SpaceBetween = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const small = css`
    width: 1px;
`;

class DataKeysTable extends React.Component {
    state = {
        selectedKeys: [],
        allSelected: false,
    };


    copy = () => {
        const {dataKeys, addNotification} = this.props;
        if (this.state.allSelected || this.state.selectedKeys.length === 0) {
            /* todo: do not copy in "addNotification", only display message */
            addNotification(JSON.stringify(dataKeys), 'All keys successfully copied!');
        }
        else if (this.state.selectedKeys.length === 1) {
            addNotification(JSON.stringify(this.state.selectedKeys), '1 key successfully copied!');
        }
        else {
            addNotification(JSON.stringify(this.state.selectedKeys), `${this.state.selectedKeys.length} keys successfully copied!`);
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
        if (this.state.allSelected && !checked) {
            this.setState({
                allSelected: false,
                selectedKeys: without(dataKeys, key),
            });
        }
        else if (!checked) {
            this.setState((previousState) => {
                const selectedKeys = without(previousState.selectedKeys, key);
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
        const {dataKeys, noKeysMessage} = this.props;
        return (
            <Table>
                <thead>
                    <Tr>
                        <Th className={small}>
                            <input
                                type="checkbox"
                                checked={this.state.allSelected}
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
                                    checked={this.state.allSelected || this.state.selectedKeys.includes(key)}
                                    onChange={this.handleCheckboxChange(key)}
                                />
                            </Td>
                            <Td className={css`font-family: ${monospaceFamily}; font-size: ${fontNormalMonospace};`}>
                                <label htmlFor={key}>{key}</label>
                            </Td>
                        </Tr>
                ))}
                    {!dataKeys.length && (
                    <Tr>
                        <Td colSpan={2}>
                            {noKeysMessage}
                        </Td>
                    </Tr>
                )}
                </tbody>
            </Table>
        );
    }
}

DataKeysTable.propTypes = {
    dataKeys: PropTypes.arrayOf(PropTypes.string),
    addNotification: PropTypes.func,
    noKeysMessage: PropTypes.string,
};

DataKeysTable.defaultProps = {
    dataKeys: [],
    noKeysMessage: 'No data assets associated yet',
    addNotification: null,
};

export default DataKeysTable;
