import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {omit} from 'lodash';
import Link from 'redux-first-router-link';

import Algo from '../../common/svg/algo';
import Dataset from '../../common/svg/data-set';
import Folder from '../../common/svg/folder';
import Model from '../../common/svg/model';

import {spacingLarge, spacingNormal, spacingSmall} from '../../../../../assets/css/variables/spacing';
import {
darkSkyBlue, slate, ice, white,
} from '../../../../../assets/css/variables/colors';
import {fontLarge} from '../../../../../assets/css/variables/font';

const Ul = styled('ul')`
    display: flex;
    list-style: none;
    margin: ${spacingNormal} ${spacingLarge} -1px ${spacingLarge};
    padding: 0;
    z-index: 1;
`;

const Li = styled('li')`
    display: inline-flex;
    align-items: stretch;
`;

const link = (active, hovered) => css`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${active || hovered ? darkSkyBlue : slate};
    font-size: ${fontLarge};
    font-weight: bold;
    text-transform: capitalize;
    padding: ${spacingSmall} ${spacingNormal};
    border-width: 3px 1px 1px 1px;
    border-style: solid;
    border-color: ${active ? `${darkSkyBlue} ${ice} ${white} ${ice}` : 'transparent'};
    background-color: ${active ? white : 'transparent'};
`;

const picto = css`
    margin: 0 8px 0 0;
`;


const pictos = {
    challenge: Folder,
    dataset: Dataset,
    algorithm: Algo,
    model: Model,
};

class Nav extends React.Component {
    state = {
        hoveredRoute: null,
    };

    isActive = (route) => {
        const {location: {type}} = this.props;

        return type === route || (route === 'CHALLENGE' && type === 'HOME');
    };

    isHovered = route => this.state.hoveredRoute === route;

    onMouseEnter = route => () => {
        this.setState({hoveredRoute: route});
    };

    onMouseLeave = route => () => {
        if (this.isHovered(route)) {
            this.setState({hoveredRoute: null});
        }
    };

    getUrl = (route) => {
        const {location, orders} = this.props;

        const menu = route.toLowerCase();
        const order = orders[menu];

        return {
            type: route,
            meta: {
                query: {
                    ...omit(location.query, ['_sw-precache', 'by', 'direction']), // remove location url order
                    ...(order.prune ? omit(order, ['prune']) : {}), // add own order if necessary
                },
            },
        };
    };

    render() {
        const {routes} = this.props;
        return (
            <Ul>
                {routes.map((route) => {
                        const active = this.isActive(route);
                        const hovered = this.isHovered(route);
                        const color = active || hovered ? darkSkyBlue : slate;

                        const menu = route.toLowerCase();
                        const Picto = pictos[menu];

                        return (
                            <Li key={route}>
                                <Link
                                    to={this.getUrl(route)}
                                    onMouseEnter={this.onMouseEnter(route)}
                                    onMouseLeave={this.onMouseLeave(route)}
                                    className={link(active, hovered)}
                                >
                                    <Picto className={picto} color={color} />
                                    {menu}
                                </Link>
                            </Li>
                        );
                    },
                )}
            </Ul>
        );
    }
}

Nav.defaultProps = {
    routes: [],
    location: {},
    orders: {},
};

Nav.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.shape({}),
    orders: PropTypes.shape({}),
};

export default Nav;
