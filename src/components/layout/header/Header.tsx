import React, { useState } from 'react';
import styled from '@emotion/styled';

import SubMenu from './SubMenu';
import SearchBar from '@/components/Searchbar';
import { H2 } from '@/components/utils/Typography';

import { Colors, Spaces } from '@/assets/theme';
import OwkinConnectLogo from '@/components/OwkinConnectLogo';

type HeaderProps = {
    title: string;
};

const Container = styled.div`
    display: flex;
    background-color: 'white';
    box-shadow: 0 0 8px 0 ${Colors.border};
    height: 72px;
    justify-content: space-between;
    align-items: center;
    padding: ${Spaces.medium};
`;

const Section = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Image = styled.img`
    margin-right: ${Spaces.medium};
`;

const UserIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${Colors.border};
    padding: 8px;
`;

const Header = ({ title }: HeaderProps): JSX.Element => {
    const [showSubMenu, toggleSubMenu] = useState(false);

    return (
        <Container>
            <Section>
                <Image alt="Owkin Connect" src={OwkinConnectLogo} />
                <H2>{title}</H2>
            </Section>
            <Section>
                <SearchBar />
                <UserIcon onClick={() => toggleSubMenu}></UserIcon>
                {showSubMenu && <SubMenu />}
            </Section>
        </Container>
    );
};

export default Header;
