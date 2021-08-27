import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { RiUserLine } from 'react-icons/ri';

import { useAppSelector } from '@/hooks';

import SubMenu from '@/components/layout/header/SubMenu';

import OwkinConnectIconSvg from '@/assets/svg/owkin-connect-icon.svg';
import { Colors, Spaces, zIndexes } from '@/assets/theme';

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
    padding: ${Spaces.medium};
    z-index: ${zIndexes.appHeader};
`;

const IconContainer = styled.div`
    width: 90px;
    text-align: center;
    margin-left: ${Spaces.large};

    & > svg {
        width: 38px;
        height: 35px;
    }
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
    margin-right: ${Spaces.medium};
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

    const authenticated = useAppSelector((state) => state.user.authenticated);

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
                <OwkinConnectIconSvg />
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
