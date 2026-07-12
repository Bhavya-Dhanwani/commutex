"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { LuClock3, LuRefreshCw, LuLogOut } from "react-icons/lu";
import { toast } from "react-toastify";
import meApi from "../../features/auth/api/me";
import logoutApi from "../../features/auth/api/logout";
import { setUser, clearUser } from "../../features/auth/state/user.slice";

export default function WaitPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [checking, setChecking] = useState(false);

  // Check if role has updated
  const checkStatus = async (silent = false) => {
    if (!silent) setChecking(true);
    try {
      const response = await meApi();
      const userData = response.user || response.data?.user;
      if (userData) {
        dispatch(setUser(userData));
        if (userData.role !== "User") {
          toast.success(`Access granted! Welcome as ${userData.role}`);
          router.push("/dashboard");
        } else if (!silent) {
          toast.info("Awaiting admin assignment...");
        }
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error("Failed to check status");
    } finally {
      if (!silent) setChecking(false);
    }
  };

  useEffect(() => {
    // Initial redirect if already set on load
    if (user && user.role !== "User") {
      router.push("/dashboard");
      return;
    }
    // Poll status every 10 seconds for a responsive UX
    const interval = setInterval(() => {
      checkStatus(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(clearUser());
      router.push("/login");
    }
  };

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FAFAFA",
      fontFamily: "var(--font-poppins), sans-serif",
      padding: "24px"
    }}>
      <div style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E7E7E7",
        borderRadius: "20px",
        padding: "40px 32px",
        maxWidth: "440px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.03)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          backgroundColor: "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#111111",
          fontSize: "24px"
        }}>
          <LuClock3 className={checking ? "spin-animation" : ""} />
        </div>

        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#111111", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
            Awaiting Role Assignment
          </h2>
          <p style={{ fontSize: "13.5px", color: "#666666", lineHeight: 1.6, margin: 0 }}>
            Wait until you get a role from the admin. Once a role has been assigned to your account, you will be able to access the commuteX platform.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "12px" }}>
          <button
            onClick={() => checkStatus(false)}
            disabled={checking}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#111111",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s"
            }}
          >
            <LuRefreshCw size={16} style={{ animation: checking ? "spin 1s linear infinite" : "none" }} />
            {checking ? "Checking..." : "Refresh Status"}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #E7E7E7",
              backgroundColor: "#FFFFFF",
              color: "#666666",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <LuLogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
