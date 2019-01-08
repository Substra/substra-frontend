import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import {css} from 'emotion';
import Link from 'redux-first-router-link';
import {omit} from 'lodash';

import {getRoutes} from './selector';
import DocLink from './components/docLink';


import Logo from '../common/svg/logo';
import {lightgrey, slate, coolBlue} from '../../../../assets/css/variables';

import Algo from '../common/svg/algo';
import Dataset from '../common/svg/data-set';
import Folder from '../common/svg/folder';
import Model from '../common/svg/model';

const wrapper = css`
    background-color: ${lightgrey};
    padding: 15px 0;
`;

const middle = css`
    display: inline-block;
    vertical-align: top;
`;

const Ul = styled('ul')`
    margin: 0;
    padding: 0;
    width: 70%;
    list-style: none;
`;

const Li = styled('li')`
    display: inline-block;
    width: 20%;
    text-transform: capitalize;
    color: ${slate};
    font-size: 16px;
`;

const logoWrapper = css`
    ${middle};
    width: 30%;
`;

const logo = css`
    width: 100%;
`;

const base = css`
    text-decoration: none;
`;

const picto = css`
    display: block;
    margin: 0 auto 15px;
`;

const pictos = {
    challenge: Folder,
    dataset: Dataset,
    algorithm: Algo,
    model: Model,
};

class Top extends Component {
    isActive = (route) => {
        const {location: {type}} = this.props;

        return type === route || (route === 'CHALLENGE' && type === 'HOME');
    };

    link = active => css`
            ${base};
            color: ${active ? coolBlue : slate};
            font-weight: ${active ? 'bold' : 'normal'};
            text-align: center;
            display: block;
        `;

    render() {
        const {routes, location} = this.props;
        return (
            <div className={wrapper}>
                <Link to={{type: 'HOME', meta: {query: location.query}}} className={logoWrapper}>
                    <Logo width={350} height={50} className={logo} />
                </Link>
                <Ul className={middle}>
                    {routes.map((o) => {
                            const active = this.isActive(o);
                            const color = active ? coolBlue : slate;

                            const menu = o.toLowerCase();
                            const Picto = pictos[menu];

                            return (
                                <Li key={o}>
                                    <Link to={{type: o, meta: {query: omit(location.query, ['_sw-precache'])}}} className={this.link(active)}>
                                        <Picto className={picto} color={color} />
                                        {menu}
                                    </Link>
                                </Li>);
                        },
                    )}
                    <Li>
                        <DocLink className={this.link(false)} />
                    </Li>
                </Ul>
            </div>
        );
    }
}

Top.defaultProps = {
    routes: [],
    location: {},
};

Top.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape({}),
};

const mapStateToProps = (state, ownProps) => ({
    routes: getRoutes(state),
    location: state.location,
    ...ownProps,
});

export default connect(mapStateToProps)(Top);
