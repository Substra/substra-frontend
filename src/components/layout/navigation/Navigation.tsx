import React from 'react';
import styled from '@emotion/styled';

import TeamIcon from '@/assets/svg/illustrations/icon-blue-team';
import { Colors, Mixins, Spaces } from '@/assets/theme';

type LinkProps = {
    isActive: boolean;
};

const Link = styled.a<LinkProps>`
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 24px;
    height: 48px;
    max-width: 48px;
    border: 1px solid ${Colors.border};
    background-color: white;
    box-shadow: 0 0 8px 0 ${Colors.veryLightContent};
    padding-left: ${Spaces.medium};
    padding-right: 12px;
    margin-bottom: 8px;
    font-weight: 900;
    text-decoration: underline;
    &:hover {
        max-width: 160px;
        background-color: white;
        & span {
            opacity: 1;
        }
    }
    & span {
        opacity: 0;
        white-space: nowrap;
        transition: all ${Mixins.transitionStyle};
    }
    transition: all ${Mixins.transitionStyle};
    border-color: ${(props) =>
        props.isActive ? Colors.primary : Colors.border};
`;

const Title = styled.span`
    opacity: 0;
    white-space: nowrap;
    transition: all ${Mixins.transitionStyle};
`;

const Navigation = (): JSX.Element => {
    const renderLink = (
        label: string,
        url: string,
        icon: JSX.Element,
        isActive: boolean
    ) => {
        return (
            <Link isActive={isActive} href={url}>
                <TeamIcon width={32} height={32} />
                <Title>{label}</Title>
            </Link>
        );
    };

    return (
        <div>
            {renderLink('login', '/login', 'u', true)}
            {renderLink('dashboard', '/dashboard', 'u', false)}
            {renderLink('Compute plan', '/computePlan', 'u', false)}
            {renderLink('Something else', 'url', 'u', true)}
        </div>
    );
};

export default Navigation;
