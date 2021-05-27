import React from 'react';

type OwkinConnectLogoProps = {
    width: number;
    height: number;
};

const defaultProps = {
    width: 340,
    height: 64,
};

const OwkinConnectLogo = ({
    width,
    height,
}: OwkinConnectLogoProps): JSX.Element => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 990 374"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <title>Owkin Connect</title>
        <defs>
            <linearGradient
                x1="75.005633%"
                y1="93.3113326%"
                x2="24.9957012%"
                y2="6.69159502%"
                id="linearGradient-1"
            >
                <stop stopColor="#EDC20F" offset="0%" />
                <stop stopColor="#1DBCC0" offset="100%" />
            </linearGradient>
        </defs>
        <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="OwkinConnect_Substra_RGB" fillRule="nonzero">
                <g id="Group" transform="translate(47.000000, 47.000000)">
                    <path
                        d="M229.35,135.71 C229.35,187.6 187.28,229.67 135.39,229.67 C83.5,229.67 41.43,187.6 41.43,135.71 C41.43,83.82 83.5,41.75 135.39,41.75 C187.28,41.75 229.35,83.82 229.35,135.71 Z M135.39,0.79 C60.87,0.79 0.47,61.2 0.47,135.71 C0.47,210.22 60.88,270.63 135.39,270.63 C209.9,270.63 270.31,210.22 270.31,135.71 C270.31,61.2 209.91,0.79 135.39,0.79 Z"
                        id="Shape"
                        fill="url(#linearGradient-1)"
                    />
                    <g fill="#231F20" id="Rectangle" opacity="0.08">
                        <rect
                            transform="translate(135.396889, 135.626598) rotate(-22.500428) translate(-135.396889, -135.626598) "
                            x="39.8994778"
                            y="40.1291868"
                            width="190.994822"
                            height="190.994822"
                        />
                        <rect
                            x="39.89"
                            y="40.13"
                            width="190.99"
                            height="190.99"
                        />
                        <rect
                            transform="translate(135.391714, 135.635577) rotate(22.500428) translate(-135.391714, -135.635577) "
                            x="39.8943028"
                            y="40.1381658"
                            width="190.994822"
                            height="190.994822"
                        />
                        <rect
                            transform="translate(135.389596, 135.616871) rotate(45.000000) translate(-135.389596, -135.616871) "
                            x="39.8955118"
                            y="40.1227868"
                            width="190.988168"
                            height="190.988168"
                        />
                    </g>
                </g>
                <path
                    d="M15.12,197.79 C6.84,197.79 0.12,191.07 0.12,182.79 C0.12,82.43 81.77,0.79 182.12,0.79 C190.4,0.79 197.12,7.51 197.12,15.79 C197.12,24.07 190.4,30.79 182.12,30.79 C98.31,30.79 30.12,98.98 30.12,182.79 C30.12,191.07 23.41,197.79 15.12,197.79 Z"
                    id="Path"
                    fill="#1DBCC0"
                />
                <path
                    d="M182.39,255.14 C142.14,255.14 109.39,222.39 109.39,182.14 C109.39,141.89 142.14,109.14 182.39,109.14 C222.64,109.14 255.39,141.89 255.39,182.14 C255.39,222.39 222.64,255.14 182.39,255.14 Z M182.39,139.14 C158.68,139.14 139.39,158.43 139.39,182.14 C139.39,205.85 158.68,225.14 182.39,225.14 C206.1,225.14 225.39,205.85 225.39,182.14 C225.39,158.43 206.1,139.14 182.39,139.14 Z"
                    id="Shape"
                    fill="#EDC20F"
                />
                <circle
                    id="Oval"
                    fill="#1DBCC0"
                    cx="182.39"
                    cy="182.67"
                    r="19.5"
                />
            </g>
        </g>
    </svg>
);

OwkinConnectLogo.defaultProps = defaultProps;

export default OwkinConnectLogo;
