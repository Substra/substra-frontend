import React from 'react';
import { Colors } from '@/assets/theme';

import { Line } from 'react-chartjs-2';

interface PerfsGraphProps {
    data: Record<string, DataType>;
}

export interface DataType {
    x: number[];
    y: number[];
}

const PerfsGraph = ({ data }: PerfsGraphProps): JSX.Element => {
    const options = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Rank',
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Accuracy',
                },
            },
        },
    };

    const formatDataset = (name: string, dataset: DataType) => {
        return {
            label: name,
            data: dataset.y,
            fill: false,
            backgroundColor: Colors.primary,
            borderColor: Colors.primaryHover,
        };
    };

    const [firstDataset] = Object.values(data);
    const { x: labels } = firstDataset; // !TODO: kinda wip, is clearly not the best way to get all the labels

    const formattedData = {
        labels,
        datasets: Object.entries(data).map(([key, dataset]) =>
            formatDataset(key, dataset)
        ),
    };

    return <Line type="line" data={formattedData} options={options} />;
};

export default PerfsGraph;
