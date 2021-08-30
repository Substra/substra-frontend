import { useRoute } from 'wouter';

import { PATHS } from '@/routes';

const Compare = (): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPARE);
    const keys = decodeURIComponent(params?.keys || '').split(',');

    return (
        <div>
            Compare compute plans:
            <ul>
                {keys.map((key) => (
                    <li key={key}>{key}</li>
                ))}
            </ul>
        </div>
    );
};
export default Compare;
