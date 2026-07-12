"use client";

import { useState } from "react";
import { LuMail, LuShieldCheck } from "react-icons/lu";

import CenteredAuthLayout from "../layouts/jsx/CenteredAuthLayout";
import Card from "../components/jsx/Card";
import Logo from "../components/jsx/Logo";
import ActionButton from "../components/jsx/ActionButton";

import resendVerificationApi from "../../api/resendVerification";
import styles from "../css/ResendVerification.module.css";
import { toast } from "react-toastify";

export default function ResendVerification() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendVerificationApi();
      setSent(true);
      toast.success("Verification email sent");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send email";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredAuthLayout>
      <Card className={styles.card}>
        <Logo />

        <div className={styles.iconContainer}>
          <LuShieldCheck size={48} />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>You are not verified</h2>
          <p className={styles.description}>
            Please verify your email address to access all features.
            Check your inbox for the verification link.
          </p>
        </div>

        {sent ? (
          <div className={styles.sentMessage}>
            <LuMail size={20} />
            <span>Verification email sent. Check your inbox.</span>
          </div>
        ) : (
          <div className={styles.buttonWrapper}>
            <ActionButton onClick={handleResend} loading={loading} icon={LuMail}>
              Send Verification Email
            </ActionButton>
          </div>
        )}
      </Card>
    </CenteredAuthLayout>
  );
}
