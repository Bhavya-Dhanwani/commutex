"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LuLayoutDashboard, LuArrowLeft } from "react-icons/lu";

import CenteredAuthLayout from "../layouts/jsx/CenteredAuthLayout";
import Card from "../components/jsx/Card";
import Logo from "../components/jsx/Logo";
import VerificationAnimation from "../components/jsx/VerificationAnimation";
import ActionButton from "../components/jsx/ActionButton";

import verifyEmailApi from "../../api/verifyEmail";
import styles from "../css/VerifyEmail.module.css";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const initialState = useMemo(() => {
    if (!token) {
      return {
        state: "error",
        error: "No verification token found. Please check your email link.",
      };
    }
    return { state: "verifying", error: "" };
  }, [token]);

  const [animState, setAnimState] = useState(initialState.state);
  const [errorMessage, setErrorMessage] = useState(initialState.error);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current || !token) return;

    hasVerified.current = true;

    const verify = async () => {
      try {
        await verifyEmailApi(token);
        setAnimState("morphing");

        setTimeout(() => {
          setAnimState("success");
        }, 400);
      } catch (error) {
        setAnimState("error");
        const message = error.response?.data?.message || "Verification failed. The link may be invalid or expired.";
        setErrorMessage(message);
      }
    };

    verify();
  }, [token]);

  const handleDashboardClick = () => {
    window.location.href = "/dashboard";
  };

  const handleLoginClick = () => {
    window.location.href = "/login";
  };

  return (
    <CenteredAuthLayout>
      <Card className={styles.card}>
        <Logo />

        <VerificationAnimation state={animState} />

        {animState === "verifying" && (
          <div className={styles.content}>
            <h2 className={styles.title}>Verifying your email</h2>
            <p className={styles.description}>Please wait while we verify your account...</p>
          </div>
        )}

        {animState === "morphing" && (
          <div className={styles.content}>
            <h2 className={styles.title}>Verifying your email</h2>
            <p className={styles.description}>Please wait while we verify your account...</p>
          </div>
        )}

        {animState === "success" && (
          <div className={`${styles.content} ${styles.fadeIn}`}>
            <h2 className={styles.title}>Email Verified!</h2>
            <p className={styles.description}>Your email has been verified successfully.</p>
            <div className={styles.buttonWrapper}>
              <ActionButton onClick={handleDashboardClick} icon={LuLayoutDashboard}>
                Go to Dashboard
              </ActionButton>
            </div>
          </div>
        )}

        {animState === "error" && (
          <div className={`${styles.content} ${styles.fadeIn}`}>
            <h2 className={styles.errorTitle}>Verification Failed</h2>
            <p className={styles.errorDescription}>{errorMessage}</p>
            <div className={styles.buttonWrapper}>
              <ActionButton variant="outline" onClick={handleLoginClick} icon={LuArrowLeft}>
                Back to Login
              </ActionButton>
            </div>
          </div>
        )}
      </Card>
    </CenteredAuthLayout>
  );
}
