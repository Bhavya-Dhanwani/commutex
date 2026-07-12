import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setUser } from "../state/user.slice";

async function login(userData) {

    // Making a POST request to the login endpoint with user data
    await api.post("/auth/login", userData)
        .then((response) => {

            // Handle successful login, e.g., store user data in Redux
            const dispatch = useDispatch();

            // Storing user data in Redux store
            dispatch(setUser(response.data.user));
        })
        .catch((error) => {

            // Handle login error
            console.error("Login error:", error);

        });

}

export default login;