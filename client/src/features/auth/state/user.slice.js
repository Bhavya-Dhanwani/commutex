// Importing modules
import { createSlice } from "@reduxjs/toolkit";

// Creating the user slice
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        accessToken: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.accessToken = null;
        },
    },
});

// Exporting actions and reducer
export const { setUser, setAccessToken, clearUser } = userSlice.actions;
export default userSlice.reducer;