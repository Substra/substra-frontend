/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { Link } from 'wouter';

import { Colors, Spaces } from '@/assets/theme';

const linkStyle = css`
    display: inline-block;
    color: ${Colors.content};
    font-weight: bold;
    font-size: 14px;
    border: 1px solid transparent;
    border-radius: ${Spaces.medium} ${Spaces.medium} 0 0;
    padding: ${Spaces.medium} ${Spaces.xxl} ${Spaces.small} ${Spaces.xxl};
    background-color: transparent;
    margin-bottom: -1px;
    margin-right: ${Spaces.extraSmall};
    text-decoration: none;

    &:hover {
        color: ${Colors.primary};
    }
`;

const activeStyle = css`
    color: ${Colors.primary};
    border-color: ${Colors.border} ${Colors.border} transparent ${Colors.border};
    background-color: white;
`;

interface PageTitleProps {
    links: {
        location: string;
        title: string;
        active: boolean;
    }[];
}

const PageTitle = ({ links }: PageTitleProps): JSX.Element => (
    <Fragment>
        {links.map(({ active, location, title }) => (
            <Link
                css={[linkStyle, active && activeStyle]}
                href={location}
                key={location}
            >
                {title}
            </Link>
        ))}
    </Fragment>
);

export default PageTitle;
