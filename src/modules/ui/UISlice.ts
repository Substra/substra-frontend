import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    expandedSection: string;
}

const initialState: UIState = {
    expandedSection: '',
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setExpandedSection: (state, action: PayloadAction<string>) => {
            state.expandedSection = action.payload;
        },
    },
});

export const { setExpandedSection } = uiSlice.actions;

export default uiSlice.reducer;
