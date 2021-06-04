import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RiUserLine } from 'react-icons/ri';

import { Colors, Spaces } from '@/assets/theme';
import OwkinConnectIcon from '@/assets/svg/OwkinConnectIcon';
import { RootState } from '@/store';

import SubMenu from './SubMenu';

type HeaderProps = {
    title: string;
};

const Container = styled.div`
    display: flex;
    background-color: white;
    box-shadow: 0 0 8px 0 ${Colors.border};
    height: 72px;
    justify-content: flex-start;
    align-items: center;
    padding: ${Spaces.medium} 0;
    z-index: 1;
`;

const IconContainer = styled.div`
    width: 120px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: 800;
    color: ${Colors.content};
`;

const UserMenuButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: ${Spaces.extraLarge};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${Colors.border};
    background-color: white;

    & > svg {
        width: 20px;
        height: 20px;
    }
`;

const Header = ({ title }: HeaderProps): JSX.Element => {
    const [showSubMenu, setSubMenu] = useState(false);

    const authenticated = useSelector(
        (state: RootState) => state.user.authenticated
    );

    const hideSubMenu = () => setSubMenu(false);

    useEffect(() => {
        if (showSubMenu) {
            window.addEventListener('click', hideSubMenu);
        } else {
            window.removeEventListener('click', hideSubMenu);
        }

        // cleanup
        return () => {
            window.removeEventListener('click', hideSubMenu);
        };
    }, [showSubMenu]);

    return (
        <Container>
            <IconContainer>
                <OwkinConnectIcon />
            </IconContainer>
            <Title>{title}</Title>
            {authenticated && (
                <>
                    <UserMenuButton
                        type="button"
                        onClick={() => setSubMenu(!showSubMenu)}
                    >
                        <RiUserLine />
                    </UserMenuButton>
                    <SubMenu visible={showSubMenu} />
                </>
            )}
        </Container>
    );
};

export default Header;
