import React from 'react';
import {storiesOf} from '@storybook/react';

import CodeSample from './codeSample';

const text = `
import os
import pandas as pd
import random
import string
import numpy as np
import logging

import substratools as tools


class Opener(tools.Opener):
    def get_X(self, folders):
        logging.info(folders)
        datas = []
        for folder in folders:
            datas.append(np.load('{}/X.npy'.format(folder)))
        return np.concatenate(datas, axis=0)

    def get_y(self, folders):
        y = []
        for folder in folders:
            y.append(np.load('{}/y.npy'.format(folder)))
        return np.concatenate(y, axis=0)

    def save_pred(self, y_pred, path):
        with open(path, 'wb') as f:
            np.save(f, y_pred)

    def get_pred(self, path):
        return np.load(path)

    def fake_X(self):
        data = np.random.random((5, 1000, 2051))
        return data

    def fake_y(self):
        y = np.random.randint(0, high=2, size=(5,))
        return y
`;

storiesOf('CodeSample', module)
    .add('default', () => (
        <CodeSample codeString={text} filename="opener.py" language="python" />
    ))
    .add('collapsible', () => (
        <CodeSample codeString={text} filename="opener.py" language="python" collapsible />
    ));
