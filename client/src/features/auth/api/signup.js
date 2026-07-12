import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/state/user.slice";

const signup = async (userData) => {

    await api.post("/auth/signup", userData)
        .then((response) => {
            const dispatch = useDispatch();

            // Handle successful signup, e.g., store user data in Redux
            dispatch(setUser(response.data.user));

        })
        .catch((error) => {

            // Handle signup error
            console.error("Signup error:", error);

        });

}

export default signup;