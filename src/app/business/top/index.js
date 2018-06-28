import React, {Component} from 'react';
import Link from 'redux-first-router-link';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {NOT_FOUND} from 'redux-first-router';

import routesMap from '../../routesMap';
import Logo from '../common/svg/logo';
import {lightgrey, slate, coolBlue} from '../../../../assets/css/variables';

const routes = Object.keys(routesMap).filter(o => ![NOT_FOUND, 'HOME'].includes(o));

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
    link = route => {
        const {type} = this.props.location;

        const active = type === route || (route === 'PROBLEM' && type === 'HOME');

        return css`
            ${base};
            color: ${active ? coolBlue : slate};
            font-weight: ${active ? 'bold' : 'normal'};
        `;
    };

    render() {
        return (
            <div className={wrapper}>
                <Link to="/">
                    <Logo width={350} height={50} className={logo}/>
                </Link>
                <Ul>
                    {routes.map(o =>
                        <Li key={o}>
                            <Link to={routesMap[o].path} className={this.link(o)}>
                                {o.toLowerCase()}
                            </Link>
                        </Li>
                    )}
                </Ul>
            </div>
        );
    }
}

const mapStateToProps = ({location}, ownProps) => ({location, ...ownProps});

export default connect(mapStateToProps)(Top);
