import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import meApi from "../api/me";
import { setUser } from "../state/user.slice";

export default function usePublicRoute() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (user) {
        router.push("/dashboard");
        return;
      }

      try {
        const response = await meApi();
        const userData = response.user || response.data?.user;
        if (userData) {
          dispatch(setUser(userData));
          router.push("/dashboard");
        } else {
          setLoading(false);
        }
      } catch (err) {
        // Not logged in, which is expected for public routes
        setLoading(false);
      }
    };

    checkSession();
  }, [user, router, dispatch]);

  return { loading };
}
