// Importing Modules
import api from "@/lib/api";

async function logout() {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}

export default logout;