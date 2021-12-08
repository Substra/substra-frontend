import { Button, IconButton, Stack } from '@chakra-ui/react';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { Link } from 'wouter';

import useLocationWithParams from '@/hooks/useLocationWithParams';

const ellipsis = (
    <Button variant="outline" size="sm" disabled={true}>
        ...
    </Button>
);

interface PageLinkProps {
    page: number;
    activePage: number;
    isDisabled?: boolean;
}
const PageLink = ({
    page,
    activePage,
    isDisabled,
}: PageLinkProps): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();
    return (
        <Link href={buildLocationWithParams({ page })}>
            <Button
                as="a"
                backgroundColor={activePage === page ? 'gray.200' : 'white'}
                variant="outline"
                size="sm"
                disabled={isDisabled}
            >
                {page}
            </Button>
        </Link>
    );
};

const PreviousPage = ({ page }: { page: number }): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();

    if (page === 0) {
        return (
            <IconButton
                variant="outline"
                size="sm"
                aria-label="Previous Page"
                icon={<RiArrowLeftLine />}
                disabled={true}
            />
        );
    }

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

const NextPage = ({
    page,
    lastPage,
}: {
    page: number;
    lastPage: number;
}): JSX.Element => {
    const { buildLocationWithParams } = useLocationWithParams();
    if (page > lastPage) {
        return (
            <IconButton
                variant="outline"
                size="sm"
                aria-label="Next Page"
                icon={<RiArrowRightLine />}
                disabled={true}
            />
        );
    }
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
    if (lastPage === 0) {
        return (
            <Stack spacing={1} direction="row">
                <PreviousPage page={currentPage - 1} />
                <PageLink page={1} activePage={0} isDisabled={true} />
                <NextPage page={currentPage + 1} lastPage={lastPage} />
            </Stack>
        );
    } else if (lastPage <= 9) {
        return (
            <Stack spacing={1} direction="row">
                <PreviousPage page={currentPage - 1} />
                {[...Array(lastPage)].map((_, index) => (
                    <PageLink
                        page={index + 1}
                        key={index + 1}
                        activePage={currentPage}
                    />
                ))}
                <NextPage page={currentPage + 1} lastPage={lastPage} />
            </Stack>
        );
    } else if (currentPage <= 5) {
        return (
            <Stack spacing={1} direction="row">
                <PreviousPage page={currentPage - 1} />
                <PageLink page={1} activePage={currentPage} />
                <PageLink page={2} activePage={currentPage} />
                <PageLink page={3} activePage={currentPage} />
                <PageLink page={4} activePage={currentPage} />
                <PageLink page={5} activePage={currentPage} />
                <PageLink page={6} activePage={currentPage} />
                <PageLink page={7} activePage={currentPage} />
                {ellipsis}
                <PageLink page={lastPage} activePage={currentPage} />
                <NextPage page={currentPage + 1} lastPage={lastPage} />
            </Stack>
        );
    } else if (currentPage >= lastPage - 4) {
        return (
            <Stack spacing={1} direction="row">
                <PreviousPage page={currentPage - 1} />
                <PageLink page={1} activePage={currentPage} />
                {ellipsis}
                <PageLink page={lastPage - 6} activePage={currentPage} />
                <PageLink page={lastPage - 5} activePage={currentPage} />
                <PageLink page={lastPage - 4} activePage={currentPage} />
                <PageLink page={lastPage - 3} activePage={currentPage} />
                <PageLink page={lastPage - 2} activePage={currentPage} />
                <PageLink page={lastPage - 1} activePage={currentPage} />
                <PageLink page={lastPage} activePage={currentPage} />
                <NextPage page={currentPage + 1} lastPage={lastPage} />
            </Stack>
        );
    } else {
        return (
            <Stack spacing={1} direction="row">
                <PreviousPage page={currentPage - 1} />
                <PageLink page={1} activePage={currentPage} />
                {ellipsis}
                <PageLink page={currentPage - 2} activePage={currentPage} />
                <PageLink page={currentPage - 1} activePage={currentPage} />
                <PageLink page={currentPage} activePage={currentPage} />
                <PageLink page={currentPage + 1} activePage={currentPage} />
                <PageLink page={currentPage + 2} activePage={currentPage} />
                {ellipsis}
                <PageLink page={lastPage} activePage={currentPage} />
                <NextPage page={currentPage + 1} lastPage={lastPage} />
            </Stack>
        );
    }
};
export default Pagination;
