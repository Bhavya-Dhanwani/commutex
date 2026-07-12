// Importing modules
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken } from "@/features/auth/state/user.slice";

// Creating an Axios instance
const api = axios.create({
    baseURL: "/api", // Replace with your API base URL
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies in requests
});

api.interceptors.request.use(

    (config) => {

        const accessToken = useSelector((state) => state.user.accessToken);

        if (accessToken !== null) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

    }

);

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (error.response && error.response.status === 401) {

            // Unauthorized error, attempt to refresh the token
            const dispatch = useDispatch();

            // Handle token refresh logic here 
            const originalRequest = error.config;

            // Call your refresh token API and update the access token in the store
            axios.post("/apia/auth/refresh", {}, { withCredentials: true })
                .then((res) => {
                    dispatch(setAccessToken(res.data.accessToken));
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(error));

        }

        return Promise.reject(error);

    }

);

export default api;