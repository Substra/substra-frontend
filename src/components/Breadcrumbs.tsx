import React from 'react';

import styled from '@emotion/styled';
import { Link } from 'wouter';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    HStack,
} from '@chakra-ui/react';

import IconTag, { IconTagProps } from '@/components/IconTag';

const StyledBreadcrumb = styled(Breadcrumb)`
    ol {
        display: flex;
        align-items: center;
    }
`;

interface BreadcrumbsProps {
    rootIcon: IconTagProps['icon'];
    rootPath: string;
    rootLabel: string;
    children: React.ReactNode;
}

const Breadcrumbs = ({
    rootIcon,
    rootPath,
    rootLabel,
    children,
}: BreadcrumbsProps): JSX.Element => (
    <StyledBreadcrumb
        paddingLeft={8}
        paddingRight={8}
        paddingTop={3}
        paddingBottom={3}
    >
        <BreadcrumbItem>
            <Link href={rootPath}>
                <BreadcrumbLink
                    color="gray.500"
                    fontSize="sm"
                    fontWeight="medium"
                    lineHeight="5"
                >
                    <HStack spacing="2.5">
                        <IconTag
                            backgroundColor="teal.100"
                            fill="teal.500"
                            icon={rootIcon}
                        />
                        <span>{rootLabel}</span>
                    </HStack>
                </BreadcrumbLink>
            </Link>
        </BreadcrumbItem>
        {children}
    </StyledBreadcrumb>
);

export default Breadcrumbs;
