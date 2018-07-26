import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import Link from 'redux-first-router-link';

import {getRoutes} from './selector';


import Logo from '../common/svg/logo';
import {lightgrey, slate, coolBlue} from '../../../../assets/css/variables';


const wrapper = css`
    background-color: ${lightgrey};
    margin: 0 auto;
    padding: 15px 0;
`;

const middle = css`
    display: inline-block;
    vertical-align: top;
`;

const Ul = styled('ul')`
    margin: 0;
    padding: 20px 0;
    width: 70%;
    list-style: none;
    ${middle};
`;

const Li = styled('li')`
    display: inline-block;
    padding: 0 3%;
    text-transform: capitalize;
    color: ${slate};
    font-size: 24px;
`;

const logo = css`
    ${middle};
    width: 30%;
`;

const base = css`
    text-decoration: none;
`;

class Top extends Component {
    link = (route) => {
        const {location: {type}} = this.props;

        const active = type === route || (route === 'CHALLENGE' && type === 'HOME');

        return css`
            ${base};
            color: ${active ? coolBlue : slate};
            font-weight: ${active ? 'bold' : 'normal'};
        `;
    };

    render() {
        const {routes, location} = this.props;

        return (
            <div className={wrapper}>
                <Link to={{type: 'HOME', meta: {query: location.query}}}>
                    <Logo width={350} height={50} className={logo} />
                </Link>
                <Ul>
                    {routes.map(o => (
                        <Li key={o}>
                            <Link to={{type: o, meta: {query: location.query}}} className={this.link(o)}>
                                {o.toLowerCase()}
                            </Link>
                        </Li>),
                    )}
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
