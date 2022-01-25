import { createSlice } from "@reduxjs/toolkit";

const initialStateValue = { location: {}, set: false };

export const locationSlice = createSlice({
  name: "location",
  initialState: { value: initialStateValue },
  reducers: {
    enterLocation: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { enterLocation } = locationSlice.actions;

export default locationSlice.reducer;
