import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventPageCategory } from '@/types';

interface UIState {
    chosenCategory: EventPageCategory;
    withDeleted: boolean;
}

const initialState: UIState = {
    chosenCategory: 'my',
    withDeleted: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setChosenCategory(state, action: PayloadAction<EventPageCategory>) {
            state.chosenCategory = action.payload;
        },
        setWithDeleted(state, action: PayloadAction<boolean>) {
            state.withDeleted = action.payload;
        },
    },
});

export const { setChosenCategory, setWithDeleted } = uiSlice.actions;
export default uiSlice.reducer;
