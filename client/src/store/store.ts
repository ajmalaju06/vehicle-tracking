import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./slices/mapSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    map: mapSlice,
    ui: uiSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { counter: CounterState }
export type AppDispatch = typeof store.dispatch;
