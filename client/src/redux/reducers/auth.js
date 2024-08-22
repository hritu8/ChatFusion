import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  user: null,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExits: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExits: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
});

export const { userExits, userNotExits } = authSlice.actions;
export default authSlice;
