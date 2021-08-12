/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from 'wouter';

import useLocationWithParams from '@/hooks/useLocationWithParams';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div``;

const linkStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    text-decoration: none;
    color: ${Colors.content};
    font-size: ${Fonts.sizes.tableContent};
    background: white;
    border-style: solid;
    border-color: ${Colors.border};
    border-width: 1px 1px 1px 0;

    &:first-of-type {
        border-left-width: 1px;
        border-top-left-radius: ${Spaces.medium};
        border-bottom-left-radius: ${Spaces.medium};
    }
    &:last-child {
        border-top-right-radius: 20px;
        border-top-right-radius: ${Spaces.medium};
        border-bottom-right-radius: ${Spaces.medium};
    }

    &:hover {
        color: ${Colors.primary};
    }
`;

const activeLinkStyle = css`
    font-weight: bold;
    color: ${Colors.primary};
`;

const Ellipsis = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: ${Colors.content};
    font-size: ${Fonts.sizes.tableContent};
    background: white;
    border-style: solid;
    border-color: ${Colors.border};
    border-width: 1px 1px 1px 0;
`;

interface PageLinkProps {
    page: number;
    activePage: number;
}
const PageLink = ({ page, activePage }: PageLinkProps): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();
    return (
        <Link
            href={buildLocationWithParams({ page })}
            css={[linkStyle, activePage === page && activeLinkStyle]}
        >
            {page}
        </Link>
    );
};

interface PaginationProps {
    currentPage: number;
    lastPage: number;
}
const Pagination = ({
    currentPage,
    lastPage,
}: PaginationProps): JSX.Element => {
    if (lastPage <= 9) {
        return (
            <Container>
                {[...Array(lastPage)].map((_, index) => (
                    <PageLink
                        page={index + 1}
                        key={index + 1}
                        activePage={currentPage}
                    />
                ))}
            </Container>
        );
    } else if (currentPage <= 5) {
        return (
            <Container>
                <PageLink page={1} activePage={currentPage} />
                <PageLink page={2} activePage={currentPage} />
                <PageLink page={3} activePage={currentPage} />
                <PageLink page={4} activePage={currentPage} />
                <PageLink page={5} activePage={currentPage} />
                <PageLink page={6} activePage={currentPage} />
                <PageLink page={7} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={lastPage} activePage={currentPage} />
            </Container>
        );
    } else if (currentPage >= lastPage - 4) {
        return (
            <Container>
                <PageLink page={1} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={lastPage - 6} activePage={currentPage} />
                <PageLink page={lastPage - 5} activePage={currentPage} />
                <PageLink page={lastPage - 4} activePage={currentPage} />
                <PageLink page={lastPage - 3} activePage={currentPage} />
                <PageLink page={lastPage - 2} activePage={currentPage} />
                <PageLink page={lastPage - 1} activePage={currentPage} />
                <PageLink page={lastPage} activePage={currentPage} />
            </Container>
        );
    } else {
        return (
            <Container>
                <PageLink page={1} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={currentPage - 2} activePage={currentPage} />
                <PageLink page={currentPage - 1} activePage={currentPage} />
                <PageLink page={currentPage} activePage={currentPage} />
                <PageLink page={currentPage + 1} activePage={currentPage} />
                <PageLink page={currentPage + 2} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={lastPage} activePage={currentPage} />
            </Container>
        );
    }
};
export default Pagination;
