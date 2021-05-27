/** @jsx jsx */
import React, { MouseEvent } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useLocation } from 'wouter';
import { unwrapResult } from '@reduxjs/toolkit';

import { logOut } from '@/modules/user/UserSlice';
import { ROUTES } from '@/routes';
import { useAppDispatch } from '@/store';
import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.ul`
    position: fixed;
    top: 65px;
    right: ${Spaces.large};
    box-shadow: 0 0 8px ${Colors.border};
    width: 150px;
    border-radius: 16px;
    background-color: white;
    z-index: 1;
    opacity: 1;
    transition: all 0.1s linear;

    &:before {
        display: block;
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: -4px;
        right: 19px;
        background-color: transparent;
        width: 9px;
        height: 9px;
        transform: translateX(-50%) rotate(45deg);
        border-color: #fff transparent transparent #fff;
        border-style: solid;
        border-width: 4.5px;
        box-shadow: -2px -2px 5px ${Colors.border};
    }
`;

const invisibleContainer = css`
    opacity: 0;
    top: 56px;
    pointer-events: none;
`;

const Li = styled.li`
    margin: ${Spaces.large};
`;

const LogOutButton = styled.button`
    border: none;
    background: none;
    font: inherit;
    padding: 0;

    &:hover {
        opacity: 0.8;
    }
`;

const Version = styled.li`
    opacity: 0.2;
    font-size: ${Fonts.sizes.smallBody};
    margin: ${Spaces.medium};
`;

interface SubMenuProps {
    visible: boolean;
}

const SubMenu = ({ visible }: SubMenuProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const handleLogOut = () => {
        dispatch(logOut())
            .then(unwrapResult)
            .then(() => setLocation(ROUTES.LOGIN.path));
    };

    // prevent clicks in the component from bubbling up
    const stopPropagation = (e: MouseEvent) => e.stopPropagation();

    return (
        <Container
            css={[!visible && invisibleContainer]}
            aria-hidden={!visible}
            onClick={stopPropagation}
        >
            <Li>
                <LogOutButton onClick={handleLogOut}>Logout</LogOutButton>
            </Li>
            {/* TODO: use proper build version */}
            <Version>{`Owkin Connect build nº lorem ipsum`}</Version>
        </Container>
    );
};

export default SubMenu;
