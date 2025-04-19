import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    showDeleted: boolean;
}

const initialState: UIState = {
    showDeleted: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setShowDeleted(state, action: PayloadAction<boolean>) {
            state.showDeleted = action.payload;
        },
    },
});

export const { setShowDeleted } = uiSlice.actions;
export default uiSlice.reducer;
