import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {NOT_FOUND} from 'redux-first-router';

import Link from 'redux-first-router-link';

import Logo from '../common/svg/logo';
import {lightgrey, slate, coolBlue} from '../../../../assets/css/variables';
import routesMap from "../../routesMap";


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

        const active = type === route || (route === 'PROBLEM' && type === 'HOME');

        return css`
            ${base};
            color: ${active ? coolBlue : slate};
            font-weight: ${active ? 'bold' : 'normal'};
        `;
    };

    render() {
        const {location: {routesMap}} = this.props;

        // TODO pu int selector
        const routes = Object.keys(routesMap).filter(o => ![NOT_FOUND, 'HOME'].includes(o));

        return (
            <div className={wrapper}>
                <Link to={{type: 'HOME'}}>
                    <Logo width={350} height={50} className={logo} />
                </Link>
                <Ul>
                    {routes.map(o => (
                        <Li key={o}>
                            <Link to={{type: o}} className={this.link(o)}>
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
    location: {},
};

Top.propTypes = {
    location: PropTypes.shape({}),
};

const mapStateToProps = ({location}, ownProps) => ({location, ...ownProps});

export default connect(mapStateToProps)(Top);
