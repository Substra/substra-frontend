import { Button, IconButton, Stack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { Link } from 'wouter';

import useLocationWithParams from '@/hooks/useLocationWithParams';

import { Colors, Fonts } from '@/assets/theme';

const Ellipsis = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: ${Colors.content};
    font-size: ${Fonts.sizes.tableContent};
    background: white;
    border-style: solid;
    border-color: ${Colors.border};
    border-width: 1px 1px 1px 0;
`;

interface PageLinkProps {
    page: number;
    activePage?: number;
}
const PageLink = ({ page, activePage }: PageLinkProps): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();
    return (
        <Link href={buildLocationWithParams({ page })}>
            <Button
                as="a"
                isActive={activePage === page}
                variant="outline"
                size="sm"
            >
                {page}
            </Button>
        </Link>
    );
};

const PreviousPage = ({ page }: PageLinkProps): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();

    return (
        <Link href={buildLocationWithParams({ page })}>
            <IconButton
                as="a"
                variant="outline"
                size="sm"
                aria-label="Previous Page"
                icon={<RiArrowLeftLine />}
            />
        </Link>
    );
};

const NextPage = ({ page }: PageLinkProps): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();
    return (
        <Link href={buildLocationWithParams({ page })}>
            <IconButton
                as="a"
                variant="outline"
                size="sm"
                aria-label="Next Page"
                icon={<RiArrowRightLine />}
            />
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
            <Stack spacing={1} direction="row">
                {currentPage !== 1 && <PreviousPage page={currentPage - 1} />}
                {[...Array(lastPage)].map((_, index) => (
                    <PageLink
                        page={index + 1}
                        key={index + 1}
                        activePage={currentPage}
                    />
                ))}
                {currentPage !== lastPage && (
                    <NextPage page={currentPage + 1} />
                )}
            </Stack>
        );
    } else if (currentPage <= 5) {
        return (
            <Stack spacing={1} direction="row">
                {currentPage !== 1 && <PreviousPage page={currentPage - 1} />}
                <PageLink page={1} activePage={currentPage} />
                <PageLink page={2} activePage={currentPage} />
                <PageLink page={3} activePage={currentPage} />
                <PageLink page={4} activePage={currentPage} />
                <PageLink page={5} activePage={currentPage} />
                <PageLink page={6} activePage={currentPage} />
                <PageLink page={7} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={lastPage} activePage={currentPage} />
                {currentPage !== lastPage && (
                    <NextPage page={currentPage + 1} />
                )}
            </Stack>
        );
    } else if (currentPage >= lastPage - 4) {
        return (
            <Stack spacing={1} direction="row">
                {currentPage !== 1 && <PreviousPage page={currentPage - 1} />}
                <PageLink page={1} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={lastPage - 6} activePage={currentPage} />
                <PageLink page={lastPage - 5} activePage={currentPage} />
                <PageLink page={lastPage - 4} activePage={currentPage} />
                <PageLink page={lastPage - 3} activePage={currentPage} />
                <PageLink page={lastPage - 2} activePage={currentPage} />
                <PageLink page={lastPage - 1} activePage={currentPage} />
                <PageLink page={lastPage} activePage={currentPage} />
                {currentPage !== lastPage && (
                    <NextPage page={currentPage + 1} />
                )}
            </Stack>
        );
    } else {
        return (
            <Stack spacing={1} direction="row">
                {currentPage !== 1 && <PreviousPage page={currentPage - 1} />}
                <PageLink page={1} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={currentPage - 2} activePage={currentPage} />
                <PageLink page={currentPage - 1} activePage={currentPage} />
                <PageLink page={currentPage} activePage={currentPage} />
                <PageLink page={currentPage + 1} activePage={currentPage} />
                <PageLink page={currentPage + 2} activePage={currentPage} />
                <Ellipsis>...</Ellipsis>
                <PageLink page={lastPage} activePage={currentPage} />
                {currentPage !== lastPage && (
                    <NextPage page={currentPage + 1} />
                )}
            </Stack>
        );
    }
};
export default Pagination;
