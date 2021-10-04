import styled from '@emotion/styled';
import { Link } from 'wouter';

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
};
const A = styled.a<AProps>`
    display: flex;
    align-items: center;
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

interface HeaderNavigationProps {
    navItems: {
        label: string;
        href: string;
        paths: string[];
    }[];
    isActive: (paths: string[]) => boolean;
}
const HeaderNavigation = ({
    navItems,
    isActive,
}: HeaderNavigationProps): JSX.Element => {
    /**
     * This component follows the accessibility recommendations of the W3C
     * https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
     * */
    return (
        <Nav>
            <Ol role="menubar">
                {navItems.map(({ label, href, paths }) => (
                    <Li role="none" key={href}>
                        <Link href={href}>
                            <A role="menuitem" active={isActive(paths)}>
                                {label}
                            </A>
                        </Link>
                    </Li>
                ))}
            </Ol>
        </Nav>
    );
};

export default HeaderNavigation;
