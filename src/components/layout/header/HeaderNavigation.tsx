import styled from '@emotion/styled';

import { useHrefLocation } from '@/hooks/useLocationWithParams';

const Nav = styled.nav`
    display: flex;
    align-self: stretch;
`;

const Ol = styled.ol`
    display: flex;
    align-self: stretch;
`;

const Li = styled.li`
    display: flex;
    align-items: stretch;

    &:not(:last-child) {
        margin-right: var(--chakra-space-5);
    }
`;

type AProps = {
    active: boolean;
    onClick: (path: string) => void;
};
const A = styled.a<AProps>`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: var(--chakra-fontSizes-sm);
    font-weight: var(--chakra-fontWeights-medium);
    line-height: var(--chakra-lineHeights-5);
    border-bottom: 2px solid
        ${({ active }) =>
            active ? 'var(--chakra-colors-teal-500)' : 'transparent'};
    color: ${({ active }) =>
        active
            ? 'var(--chakra-colors-gray-800)'
            : 'var(--chakra-colors-gray-500)'};
`;

type HeaderNavigationProps = {
    navItems: {
        label: string;
        href: string;
        paths: string[];
    }[];
    isActive: (paths: string[]) => boolean;
};
const HeaderNavigation = ({
    navItems,
    isActive,
}: HeaderNavigationProps): JSX.Element => {
    const [, setHrefLocation] = useHrefLocation();

    /**
     * This component follows the accessibility recommendations of the W3C
     * https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
     * */
    return (
        <Nav>
            <Ol role="menubar">
                {navItems.map(({ label, href, paths }) => (
                    <Li role="none" key={href}>
                        <A
                            role="menuitem"
                            active={isActive(paths)}
                            onClick={() => setHrefLocation(href)}
                        >
                            {label}
                        </A>
                    </Li>
                ))}
            </Ol>
        </Nav>
    );
};

export default HeaderNavigation;
