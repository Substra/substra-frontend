/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { unwrapResult } from '@reduxjs/toolkit';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { useLocation } from 'wouter';

import { logOut } from '@/modules/user/UserSlice';

import { useAppDispatch } from '@/hooks';
import useAppSelector from '@/hooks/useAppSelector';

import { PATHS } from '@/routes';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.ul`
    position: fixed;
    top: 65px;
    right: ${Spaces.large};
    box-shadow: 0 0 8px ${Colors.border};
    width: 250px;
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

const ItemTitle = styled.div`
    font-size: ${Fonts.sizes.smallBody};
    color: ${Colors.lightContent};
`;

const LogOutButton = styled.button`
    border: none;
    background: none;
    font: inherit;
    padding: 0;
    display: inline-flex;
    align-items: center;

    &:hover {
        opacity: 0.8;
    }

    & > svg {
        margin-right: ${Spaces.small};
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

// Declaration of type for global variable injected at build.
declare const __APP_VERSION__: string;

const SubMenu = ({ visible }: SubMenuProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const handleLogOut = () => {
        dispatch(logOut())
            .then(unwrapResult)
            .then(() => setLocation(PATHS.LOGIN));
    };

    // prevent clicks in the component from bubbling up
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
    const currentNodeID = useAppSelector((state) => state.nodes.info.node_id);
    const backendVersion = useAppSelector((state) => state.nodes.info.version);

    return (
        <Container
            css={[!visible && invisibleContainer]}
            aria-hidden={!visible}
            onClick={stopPropagation}
        >
            <Li>
                <ItemTitle>Current node</ItemTitle>
                {currentNodeID}
            </Li>
            <Li>
                <LogOutButton onClick={handleLogOut}>
                    <RiLogoutCircleRLine />
                    Logout
                </LogOutButton>
            </Li>
            <Version>
                {`Frontend build ${__APP_VERSION__}`} <br />
                {`Backend build ${backendVersion}`}
            </Version>
        </Container>
    );
};

export default SubMenu;
