// Importing Modules
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { clearUser } from "@/features/auth/state/user.slice";

async function logout() {


    await api.post("/auth/logout")
        .then(() => {

            // Handle successful logout, e.g., clear user data in Redux
            const dispatch = useDispatch();

            // Handle successful logout, e.g., clear user data in Redux
            dispatch(clearUser());

        })
        .catch((error) => {

            // Handle logout error
            console.error("Logout error:", error);

        });

}

export default logout;