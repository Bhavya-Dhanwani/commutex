// Importing modules
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/auth/state/user.slice";

// Creating the Redux store
const store = configureStore({

    reducer: {
        // Add your reducers here
        user: userReducer,
    },

});

export default store;