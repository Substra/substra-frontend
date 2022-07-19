import { useState } from 'react';

export type OnOptionChangeT = (
    value: string
) => (event: React.ChangeEvent<HTMLInputElement>) => void;

const useSelection = (
    initialSelection: string[] = []
): [string[], OnOptionChangeT, () => void, (values: string[]) => void] => {
    const [selection, setSelection] = useState<string[]>(initialSelection);

    const onSelectionChange =
        (value: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            const selected = selection.includes(value);

            if (checked && !selected) {
                setSelection([...selection, value]);
            }

            if (!checked && selected) {
                setSelection(selection.filter((v) => v !== value));
            }
        };

    const resetSelection = () => {
        setSelection([]);
    };

    return [selection, onSelectionChange, resetSelection, setSelection];
};

export default useSelection;
