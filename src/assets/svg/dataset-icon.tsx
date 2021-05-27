import React from 'react';

function SvgComponent(props: React.SVGProps<SVGSVGElement>): JSX.Element {
    return (
        <svg
            width="20px"
            height="24px"
            viewBox="0 0 20 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <title>Data icon</title>
            <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <g
                    id="#02_Data_Dataset_000"
                    transform="translate(-46.000000, -159.000000)"
                >
                    <g id="Nav" transform="translate(32.000000, 91.000000)">
                        <g
                            id="Data-Button"
                            transform="translate(0.000000, 56.000000)"
                        >
                            <g
                                id="Data-icon"
                                transform="translate(14.000000, 12.000000)"
                            >
                                <path
                                    d="M9.85,0 C4.925,0 0.005,1.23 0.005,3.69 L0.005,20.305 C0.005,22.765 4.93,23.995 9.85,23.995 C14.77,23.995 19.695,22.765 19.695,20.305 L19.695,3.69 C19.695,1.23 14.775,0 9.85,0 Z M18.465,20.31 C18.465,21.32 15.105,22.77 9.85,22.77 C4.595,22.77 1.235,21.32 1.235,20.31 L1.235,16.62 C3.005,17.85 6.44,18.465 9.85,18.465 C13.26,18.465 16.695,17.85 18.465,16.655 L18.465,20.31 Z M18.465,14.77 C18.465,15.78 15.105,17.23 9.85,17.23 C4.595,17.23 1.235,15.78 1.235,14.77 L1.235,11.08 C3.005,12.31 6.44,12.89 9.85,12.89 C13.26,12.89 16.695,12.31 18.465,11.08 L18.465,14.77 Z M18.465,9.23 C18.465,10.24 15.105,11.69 9.85,11.69 C4.595,11.69 1.235,10.24 1.235,9.23 L1.235,5.54 C3.005,6.77 6.44,7.385 9.85,7.385 C13.26,7.385 16.695,6.77 18.465,5.575 L18.465,9.23 Z M9.85,6.155 C4.595,6.155 1.235,4.705 1.235,3.695 C1.235,2.685 4.595,1.23 9.85,1.23 C15.105,1.23 18.465,2.68 18.465,3.69 C18.465,4.7 15.105,6.155 9.85,6.155 Z"
                                    id="Shape"
                                    fill="#1DBCC0"
                                    fillRule="nonzero"
                                ></path>
                                <path
                                    d="M8.40141373,20.2699282 C11.5085419,20.4893224 14.4765623,20.066013 17.3054747,19"
                                    id="Path-2"
                                    stroke="#EDC20F"
                                    strokeLinecap="round"
                                ></path>
                                <path
                                    d="M10.9623791,14.8038055 C13.1492177,14.7040435 15.2635828,14.2694417 17.3054747,13.5"
                                    id="Path-2-Copy"
                                    stroke="#EDC20F"
                                    strokeLinecap="round"
                                ></path>
                                <path
                                    d="M13.0421574,9.10477821 C14.4967338,8.89115897 15.9178395,8.52289957 17.3054747,8"
                                    id="Path-2-Copy-2"
                                    stroke="#EDC20F"
                                    strokeLinecap="round"
                                ></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}

export default SvgComponent;
