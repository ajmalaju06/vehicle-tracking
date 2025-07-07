import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiSliceState {
  isLeftPanelOpen?: boolean;
}

const initialState: UiSliceState = {
  isLeftPanelOpen: false,
};

export const uiSlice = createSlice({
  name: "uiSlice",
  initialState,
  reducers: {
    setIsLeftPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isLeftPanelOpen = action.payload;
    },
  },
});

// Export actions
export const { setIsLeftPanelOpen } = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
