import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveState } from "./types";

const initialState: LiveState = {
  song: {
    isPlaying: false,
    recordMode: false,
  },
};

export const live = createSlice({
  name: "live",
  initialState: initialState,
  reducers: {
    updateLive: (state, { payload }: PayloadAction<LiveState>) => {
      return {
        ...state,
        ...payload,
      };
    },
    resetLive: () => initialState,
  },
});
export const { updateLive, resetLive } = live.actions;

export default live.reducer;
