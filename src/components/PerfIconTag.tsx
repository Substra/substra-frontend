import { Icon, Tag } from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';

import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';
import usePerfBrowserPointStyles from '@/hooks/usePerfBrowserPointStyles';

interface PerfIconTagProps {
    worker: string;
    computePlanKey: string;
}
const PerfIconTag = ({
    worker,
    computePlanKey,
}: PerfIconTagProps): JSX.Element => {
    const { getColorScheme } = usePerfBrowserColors();
    const { getPointStyleComponent, getPointStyleVariant } =
        usePerfBrowserPointStyles();

    const IconComponent = getPointStyleComponent(worker);
    const variant = getPointStyleVariant(worker);
    const colorScheme = getColorScheme({ worker, computePlanKey });

    const backgroundProperties =
        variant === 'fill'
            ? {
                  backgroundImage: `linear-gradient(90deg, var(--chakra-colors-${colorScheme}-500) 0%, var(--chakra-colors-${colorScheme}-500) 100%)`,
                  backgroundPosition: 'center',
                  backgroundSize: '12px 1px',
                  backgroundRepeat: 'no-repeat',
              }
            : {
                  backgroundImage: `linear-gradient(90deg, var(--chakra-colors-${colorScheme}-500) 0, var(--chakra-colors-${colorScheme}-500) 1px, transparent 1px, transparent 11px, var(--chakra-colors-${colorScheme}-500) 11px, var(--chakra-colors-${colorScheme}-500) 12px)`,
                  backgroundPosition: 'center',
                  backgroundSize: '12px 2px',
                  backgroundRepeat: 'no-repeat',
              };

    return (
        <Tag
            backgroundColor={`${colorScheme}.100`}
            width="21px"
            height="21px"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            padding="0"
            {...backgroundProperties}
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
