import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ModalPayload, ModalsState } from "./types";

const initialState: ModalsState = {
    activeModal: null,
    previousModal: null
};

export const modals = createSlice({
    name: "modals",
    initialState: initialState,
    reducers: {
        setActiveModal: (
            state,
            { payload }: PayloadAction<ModalPayload>
        ) => {
            return {
                ...state,
                activeModal: payload,
                previousModal: state.activeModal
            };
        },
        returnToLastModal: (state) => {
            const prevActiveModal = state.activeModal;
            return {
                ...state,
                activeModal: state.previousModal,
                previousModal: prevActiveModal
            };
        },
        closeModals: (state) => {
            return {
                ...state,
                activeModal: null
            };
        }
    }
});

export const {
  setActiveModal,
  returnToLastModal,
} = modals.actions;

export default modals.reducer;
