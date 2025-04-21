import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    modals: {
        [key: string]: boolean;
    };
    showDeletedEvents: boolean;
}

const initialState: UIState = {
    modals: {},
    showDeletedEvents: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setShowDeleted(state, action: PayloadAction<boolean>) {
            state.showDeletedEvents = action.payload;
        },
        openModal(state, action: PayloadAction<string>) {
            state.modals[action.payload] = true;
        },
        closeModal(state, action: PayloadAction<string>) {
            state.modals[action.payload] = false;
        },
        toggleModal(state, action: PayloadAction<string>) {
            const modal = action.payload;
            state.modals[modal] = !state.modals[modal];
        },
    },
});

export const { setShowDeleted, openModal, closeModal, toggleModal } =
    uiSlice.actions;
export default uiSlice.reducer;
