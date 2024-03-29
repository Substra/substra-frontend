import { Icon, Tag } from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';

import usePerfBrowserColors from '@/features/perfBrowser/usePerfBrowserColors';
import usePerfBrowserPointStyles from '@/features/perfBrowser/usePerfBrowserPointStyles';

type PerfIconTagProps = {
    worker: string;
    computePlanKey: string;
};
const PerfIconTag = ({
    worker,
    computePlanKey,
}: PerfIconTagProps): JSX.Element => {
    const { getColorScheme } = usePerfBrowserColors();
    const { getPointStyleComponent } = usePerfBrowserPointStyles();

    const IconComponent = getPointStyleComponent(worker);
    const colorScheme = getColorScheme({ worker, computePlanKey });

    return (
        <Tag
            backgroundColor={`${colorScheme}.100`}
            width="21px"
            height="21px"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            padding="0"
            backgroundImage={`linear-gradient(90deg, var(--chakra-colors-${colorScheme}-500) 0%, var(--chakra-colors-${colorScheme}-500) 100%)`}
            backgroundPosition="center"
            backgroundSize="12px 1px"
            backgroundRepeat="no-repeat"
        >
            <Icon
                as={IconComponent ? IconComponent : RiGitCommitLine}
                fill={`${colorScheme}.500`}
                width="10px"
                height="10px"
            />
        </Tag>
    );
};
export default PerfIconTag;
